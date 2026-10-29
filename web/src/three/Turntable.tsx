/* oxlint-disable react/immutability -- R3F's documented pattern: the frame loop mutates
   preallocated three objects and a scratch record in place (no React state, no allocation). */
import { memo, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { createMaterials } from "./materials";
import type { Materials, Quality } from "./materials";
import { labelFontsReady, VINYL } from "./textures";
import { PIVOT, PLATTER, REF_ASPECT, invalidate, layoutFor, moving, pointer, rig } from "./rig";

/* ------------------------------------------------------------------ geometry helpers */

/** A flat ring in the XZ plane facing +Y with polar UVs (u = angle, v = radius). */
function polarRing(rIn: number, rOut: number, segments: number, rings = 1) {
  const pos: number[] = [];
  const uv: number[] = [];
  const nrm: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= rings; j++) {
    const v = j / rings;
    const r = rIn + (rOut - rIn) * v;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const a = u * Math.PI * 2;
      pos.push(Math.cos(a) * r, 0, -Math.sin(a) * r);
      nrm.push(0, 1, 0);
      uv.push(u, v);
    }
  }
  const row = segments + 1;
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * row + i;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  // Make sure the winding faces +Y whatever the maths above says.
  const p0 = new THREE.Vector3().fromArray(pos, idx[0] * 3);
  const p1 = new THREE.Vector3().fromArray(pos, idx[1] * 3);
  const p2 = new THREE.Vector3().fromArray(pos, idx[2] * 3);
  const n = p1.sub(p0).cross(p2.sub(p0));
  if (n.y < 0) {
    for (let k = 0; k < idx.length; k += 3) {
      const t = idx[k + 1];
      idx[k + 1] = idx[k + 2];
      idx[k + 2] = t;
    }
    g.setIndex(idx);
  }
  return g;
}

/** The rolled edge of the record: a short lathe profile. */
function vinylEdge() {
  const h = VINYL.thickness / 2;
  const R = VINYL.rOut;
  const pts = [
    new THREE.Vector2(R - 0.012, h),
    new THREE.Vector2(R - 0.004, h - 0.001),
    new THREE.Vector2(R, h - 0.006),
    new THREE.Vector2(R + 0.001, 0),
    new THREE.Vector2(R, -h + 0.006),
    new THREE.Vector2(R - 0.004, -h + 0.001),
    new THREE.Vector2(R - 0.012, -h),
  ];
  return new THREE.LatheGeometry(pts, 160);
}

/* ------------------------------------------------------------------ tonearm geometry constants */

const ARM_Y = 0.34;
const TUBE_END = 2.0;
const HEADSHELL_OFFSET = -0.38;
/** Stylus tip in arm space (before yaw). */
const TIP = { x: Math.sin(HEADSHELL_OFFSET) * 0.22, z: TUBE_END + Math.cos(HEADSHELL_OFFSET) * 0.22 };
const RECORD_Y = 0.162 + VINYL.thickness / 2;

/** Yaw that puts the stylus at a given radius from the platter centre (bisection, once). */
function yawForRadius(r: number) {
  let lo = -1.4;
  let hi = 0.2;
  const dist = (y: number) => {
    const x = PIVOT.x + TIP.x * Math.cos(y) + TIP.z * Math.sin(y);
    const z = PIVOT.z - TIP.x * Math.sin(y) + TIP.z * Math.cos(y);
    return Math.hypot(x - PLATTER.x, z - PLATTER.z);
  };
  // dist decreases as the arm swings in (yaw goes negative).
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (dist(mid) > r) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
const YAW_REST = 0.05;
const YAW_LEADIN = yawForRadius(1.46);
const YAW_DEEP = yawForRadius(1.08);
/** Pitch that drops the stylus from its hanging height onto the record surface. */
const PITCH_DOWN = Math.asin((ARM_Y - 0.115 - 0.02 - (RECORD_Y + VINYL.thickness / 2)) / TIP.z);
const PITCH_UP = -0.03;

const OMEGA = (Math.PI * 2 * (100 / 3)) / 60; // 33 1/3 rpm in rad/s

/* ------------------------------------------------------------------ light cone + dust shaders */

const coneVert = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying float vY;
  uniform float uH;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vY = (position.y + uH * 0.5) / uH; // 0 at the base, 1 at the apex
    gl_Position = projectionMatrix * mv;
  }`;
const coneFrag = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying float vY;
  uniform vec3 uColor; uniform float uOpacity;
  void main(){
    float facing = pow(abs(dot(normalize(vN), normalize(vV))), 2.2);
    float along = smoothstep(0.0, 0.45, vY) * (1.0 - smoothstep(0.82, 1.0, vY));
    float a = facing * along * uOpacity;
    gl_FragColor = vec4(uColor * a, a);
  }`;

const dustVert = /* glsl */ `
  attribute float aScale; attribute float aPhase;
  uniform float uTime; uniform float uSize; uniform float uPR;
  uniform vec3 uApex; uniform vec3 uDir; uniform float uTan;
  varying float vLit; varying float vGlint;
  void main(){
    vec3 p = position;
    float s = 0.6 + aScale;
    p += vec3(sin(uTime*0.13*s + aPhase)*0.28, sin(uTime*0.07*s + aPhase*1.7)*0.4, cos(uTime*0.11*s + aPhase*2.3)*0.28);
    vec3 v = p - uApex;
    float along = dot(v, uDir);
    float radial = length(v - uDir * along);
    vLit = mix(0.07, 1.0, 1.0 - smoothstep(0.55, 1.05, radial / max(along * uTan, 0.001)));
    vGlint = pow(max(0.0, sin(uTime * (0.6 + aScale) + aPhase * 5.0)), 18.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = min(26.0, uSize * (0.35 + aScale) * uPR / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const dustFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vLit; varying float vGlint;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vLit * uOpacity * (0.55 + vGlint * 1.6);
    gl_FragColor = vec4(uColor * a, a);
  }`;

/* ------------------------------------------------------------------ the object */

interface Props {
  quality: Quality;
  onReady: () => void;
}

/* drei's ContactShadows re-allocates (and never frees) its render targets whenever `scale` or
   `resolution` change identity, so both are constants: one bake, same size on every tier. */
const CONTACT_SCALE: [number, number] = [8, 6.4];
const CONTACT_POS: [number, number, number] = [0, -0.62, 0];

const KEY_INTENSITY = 210;
const RIM_INTENSITY = 5.5;
const SPOT_POS = new THREE.Vector3(-3.1, 8.9, 3.7);
const SPOT_TARGET = new THREE.Vector3(PLATTER.x + 0.3, 0, PLATTER.z);

export function Turntable({ quality, onReady }: Props) {
  const gl = useThree((s) => s.gl);
  const [mats, setMats] = useState<Materials | null>(null);

  /* Materials wait for the label fonts so the labels never bake a fallback face. */
  useEffect(() => {
    let alive = true;
    labelFontsReady().then(() => {
      if (!alive) return;
      setMats(createMaterials(quality, Math.min(8, gl.capabilities.getMaxAnisotropy())));
      invalidate(3);
    });
    return () => {
      alive = false;
    };
  }, [quality, gl]);
  /* Free a set only once its replacement is on screen (or on unmount): disposing earlier lets a
     still-mounted mesh draw it again, and three would silently re-upload the textures. */
  useEffect(() => () => mats?.dispose(), [mats]);

  if (!mats) return null;
  return <Object3D mats={mats} quality={quality} onReady={onReady} />;
}

/* Memoised: a parent re-render (tier, quiet beat) must not rebuild anything below. */
const Object3D = memo(function Object3D({ mats, quality, onReady }: { mats: Materials; quality: Quality; onReady: () => void }) {
  const full = quality === "full";
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  /* Narrower than the layout's reference aspect: pull back so the object stays whole. */
  const fit = useMemo(() => {
    const layout = layoutFor(size.width, size.height);
    const k = Math.max(1, REF_ASPECT[layout] / (size.width / size.height));
    // Wide but narrower than 16:10 (tablets, 1024 x 768): smaller and further right, clear of the headline.
    return layout === "wide" ? { dist: Math.pow(k, 1.7), sx: (k - 1) * 0.7 } : { dist: k, sx: 0 };
  }, [size]);

  /* Hand-made geometry, shared where repeated, disposed on unmount. */
  const geo = useMemo(() => {
    // Subdivided radially so v stays exact: one long trapezoid per segment makes the rings zigzag.
    const vinylFace = polarRing(VINYL.rIn, VINYL.rOut, 384, 12);
    const label = new THREE.CircleGeometry(VINYL.label, 96);
    const edge = vinylEdge();
    const mat = polarRing(0.05, 1.5, 128, 1);
    const strobe = polarRing(1.5, 1.62, 384, 2);
    const cone = new THREE.ConeGeometry(1, 1, 64, 1, true);
    const n = full ? 300 : 120;
    const dust = new THREE.BufferGeometry();
    const p = new Float32Array(n * 3);
    const sc = new Float32Array(n);
    const ph = new Float32Array(n);
    let seed = 17;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const dir = SPOT_TARGET.clone().sub(SPOT_POS);
    const len = dir.length();
    dir.normalize();
    const side = new THREE.Vector3(1, 0, 0).cross(dir).normalize();
    const up = dir.clone().cross(side).normalize();
    for (let i = 0; i < n; i++) {
      const t = 0.2 + rnd() * 0.72;
      const radius = len * t * 0.26 * Math.sqrt(rnd()) * 1.35;
      const a = rnd() * Math.PI * 2;
      const c = SPOT_POS.clone()
        .addScaledVector(dir, len * t)
        .addScaledVector(side, Math.cos(a) * radius)
        .addScaledVector(up, Math.sin(a) * radius);
      p.set([c.x, c.y, c.z], i * 3);
      sc[i] = rnd();
      ph[i] = rnd() * 100;
    }
    dust.setAttribute("position", new THREE.BufferAttribute(p, 3));
    dust.setAttribute("aScale", new THREE.BufferAttribute(sc, 1));
    dust.setAttribute("aPhase", new THREE.BufferAttribute(ph, 1));
    return { vinylFace, label, edge, mat, strobe, cone, dust, coneLen: len, dir };
  }, [full]);
  useEffect(() => () => Object.values(geo).forEach((g) => g instanceof THREE.BufferGeometry && g.dispose()), [geo]);

  /* Light cone and dust materials (shader uniforms are animated, so they are owned here). */
  const fx = useMemo(() => {
    const cone = new THREE.ShaderMaterial({
      vertexShader: coneVert,
      fragmentShader: coneFrag,
      uniforms: { uColor: { value: new THREE.Color("#f3d28c") }, uOpacity: { value: 0.1 }, uH: { value: 1 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const dust = new THREE.ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 75 },
        uPR: { value: gl.getPixelRatio() },
        uColor: { value: new THREE.Color("#f2d79a") },
        uOpacity: { value: 1 },
        uApex: { value: SPOT_POS.clone() },
        uDir: { value: geo.dir.clone() },
        uTan: { value: 0.26 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { cone, dust };
  }, [gl, geo]);
  useEffect(() => () => Object.values(fx).forEach((m) => m.dispose()), [fx]);

  /* Refs the frame loop writes into. */
  const tiltRef = useRef<THREE.Group>(null);
  const recordRef = useRef<THREE.Group>(null);
  const recordTilt = useRef<THREE.Group>(null);
  const recordFlip = useRef<THREE.Group>(null);
  const recordSpin = useRef<THREE.Group>(null);
  const armYaw = useRef<THREE.Group>(null);
  const armPitch = useRef<THREE.Group>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const coneMesh = useRef<THREE.Mesh>(null);

  /* Scratch state: preallocated, mutated in place. */
  const s = useMemo(
    () => ({
      target: new THREE.Vector3(),
      tiltX: 0,
      tiltY: 0,
      spin: 0,
      dustTime: 0,
      fov: 0,
      frames: 0,
      readySent: false,
      scrim: null as HTMLElement | null,
      veil: null as HTMLElement | null,
      host: null as HTMLElement | null,
      fadeValue: -1,
      scrimValue: -1,
      veilValue: -1,
    }),
    [],
  );

  useEffect(() => {
    s.scrim = document.querySelector<HTMLElement>('[data-scrim="side"]');
    s.veil = document.querySelector<HTMLElement>('[data-scrim="veil"]');
    s.host = gl.domElement.parentElement?.parentElement ?? null;
    // Place the cone between the spot and its target once.
    const m = coneMesh.current;
    if (m) {
      const len = geo.coneLen;
      const radius = len * 0.27;
      m.scale.set(radius, len, radius);
      m.position.copy(SPOT_POS).addScaledVector(geo.dir, len / 2);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), geo.dir.clone().negate());
      fx.cone.uniforms.uH.value = 1;
    }
    if (spot.current) {
      spot.current.target.position.copy(SPOT_TARGET);
      spot.current.target.updateMatrixWorld();
      // Light tier: no shadow, so release the map the full tier allocated.
      if (!full && spot.current.shadow.map) {
        spot.current.shadow.map.dispose();
        spot.current.shadow.map = null;
      }
    }
    invalidate(3);
  }, [geo, fx, s, gl, full]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const camera = state.camera as THREE.PerspectiveCamera;
    const { gl: renderer, scene: room } = state;

    /* Camera from the rig, then the off-axis shift that places the object in the layout. */
    const rec = rig.recede * (1 - Math.min(1, rig.beat));
    s.target.set(rig.tx, rig.ty, rig.tz);
    camera.position.set(rig.cx, rig.cy, rig.cz).sub(s.target).multiplyScalar(fit.dist * (1 + rig.intro * 0.9 + rec * 0.55)).add(s.target);
    camera.position.y -= rig.intro * 1.6;
    camera.lookAt(s.target);
    if (camera.fov !== rig.fov) camera.fov = rig.fov;
    camera.updateProjectionMatrix();
    const e = camera.projectionMatrix.elements;
    e[8] = -(rig.sx + rec * 0.35 + (rig.sx > 0 ? fit.sx : rig.sx < 0 ? -fit.sx : 0));
    e[9] = -(rig.sy + rec * 0.1);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

    /* Pointer tilt, damped, about 4 degrees at most. */
    const k = 1 - Math.exp(-dt * 3.2);
    const tx = pointer.x * 0.07;
    const ty = pointer.y * 0.045;
    s.tiltY += (tx - s.tiltY) * k;
    s.tiltX += (ty - s.tiltX) * k;
    const settling = Math.abs(tx - s.tiltY) > 0.0004 || Math.abs(ty - s.tiltX) > 0.0004;
    if (tiltRef.current) {
      tiltRef.current.rotation.y = s.tiltY;
      tiltRef.current.rotation.x = s.tiltX;
    }

    /* Record: lift, tilt edge-on, flip for Side B, spin. */
    const flipBump = Math.sin(rig.flip);
    const flipping = flipBump > 0.002;
    // The lift leads the turn (sqrt) so the edge never dips into the platter, and at 90 degrees
    // the lowest point of the record clears the spindle.
    if (recordRef.current) recordRef.current.position.y = RECORD_Y + rig.lift + Math.sqrt(Math.max(0, flipBump)) * 1.8;
    if (recordTilt.current) recordTilt.current.rotation.x = rig.tilt;
    if (recordFlip.current) recordFlip.current.rotation.z = rig.flip;
    const dir = Math.cos(rig.flip) >= 0 ? -1 : 1;
    const spinNow = rig.spin * rig.iSpin * (1 - Math.min(1, flipBump * 1.4));
    if (recordSpin.current) recordSpin.current.rotation.y += dir * OMEGA * spinNow * dt;

    /* Tonearm: rest, lead-in, deeper; the needle lifts whenever the record is lifted or flipped. */
    const arm = rig.arm + rig.iArm;
    const yaw = arm <= 1 ? YAW_REST + (YAW_LEADIN - YAW_REST) * arm : YAW_LEADIN + (YAW_DEEP - YAW_LEADIN) * Math.min(1, arm - 1);
    const needle = Math.min(1, rig.needle + rig.iNeedle) * (1 - Math.min(1, flipBump * 3)) * (1 - Math.min(1, rig.lift * 4));
    if (armYaw.current) armYaw.current.rotation.y = yaw;
    if (armPitch.current) armPitch.current.rotation.x = PITCH_UP + (PITCH_DOWN - PITCH_UP) * needle;

    /* Light and atmosphere. */
    if (spot.current) spot.current.intensity = KEY_INTENSITY * rig.key;
    if (rim.current) rim.current.intensity = RIM_INTENSITY * rig.rim;
    room.environmentIntensity = rig.env;
    renderer.toneMappingExposure = rig.exposure * (1 - rig.intro * 0.92) * (1 - rec * 0.82);
    fx.cone.uniforms.uOpacity.value = 0.42 * rig.cone * rig.iCone;
    fx.dust.uniforms.uOpacity.value = rig.dust;
    s.dustTime += dt * (0.35 + 0.65 * rig.spin);
    fx.dust.uniforms.uTime.value = s.dustTime;
    fx.dust.uniforms.uPR.value = renderer.getPixelRatio();

    /* DOM scrim behind the text (write only on change). */
    if (s.scrim && Math.abs(s.scrimValue - rig.scrim) > 0.004) {
      s.scrimValue = rig.scrim;
      s.scrim.style.opacity = rig.scrim.toFixed(3);
    }
    if (s.host && Math.abs(s.fadeValue - rig.fade) > 0.004) {
      s.fadeValue = rig.fade;
      s.host.style.opacity = (1 - rig.fade).toFixed(3);
    }
    const veil = Math.max(rig.veil, rig.veilBoost);
    if (s.veil && Math.abs(s.veilValue - veil) > 0.004) {
      s.veilValue = veil;
      s.veil.style.opacity = veil.toFixed(3);
    }

    /* Keep drawing while anything moves; otherwise the ticker renders on demand. */
    moving.value = spinNow > 0.01 || flipping || settling || rig.dust > 0.3 || rig.intro > 0.001 || rec > 0.001;

    if (!s.readySent && ++s.frames > 2) {
      s.readySent = true;
      queueMicrotask(onReady);
    }
  });

  const castsArm = full;
  return (
    <group>
      {/* Key: one warm spotlight, the source of the visible cone. */}
      <spotLight
        ref={spot}
        position={SPOT_POS}
        angle={0.34}
        penumbra={0.9}
        decay={2}
        distance={0}
        color="#ffd7a1"
        castShadow={full}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
        shadow-normalBias={0.015}
        shadow-camera-near={5}
        shadow-camera-far={16}
      />
      {/* Rim: a gold light from behind that only wakes in the "lifted" beat. */}
      <directionalLight ref={rim} position={[-0.8, 2.2, -6]} color="#e8b863" intensity={0} />

      <mesh ref={coneMesh} geometry={geo.cone} material={fx.cone} renderOrder={2} frustumCulled={false} />
      <points geometry={geo.dust} material={fx.dust} renderOrder={3} frustumCulled={false} />

      <group ref={tiltRef}>
        {/* Plinth: black lacquer with a thin inlaid gold line, gold feet. */}
        <RoundedBox args={[5.0, 0.5, 3.8]} radius={0.07} smoothness={4} position={[0, -0.25, 0]} material={mats.lacquer} receiveShadow />
        <RoundedBox args={[5.014, 0.02, 3.814]} radius={0.01} smoothness={1} position={[0, -0.08, 0]} material={mats.gold} />
        <Feet mats={mats} />
        <Controls mats={mats} />

        {/* Platter: dark aluminium, rubber mat, polished strobe ring, chrome spindle. */}
        <mesh position={[PLATTER.x, 0.09, PLATTER.z]} material={mats.alu} receiveShadow>
          <cylinderGeometry args={[1.62, 1.6, 0.14, 128, 1]} />
        </mesh>
        <mesh geometry={geo.mat} position={[PLATTER.x, 0.1605, PLATTER.z]} material={mats.rubber} receiveShadow />
        <mesh geometry={geo.strobe} position={[PLATTER.x, 0.1606, PLATTER.z]} material={mats.strobe} receiveShadow />
        <mesh position={[PLATTER.x, 0.22, PLATTER.z]} material={mats.chrome}>
          <cylinderGeometry args={[0.026, 0.028, 0.12, 20]} />
        </mesh>

        {/* The record */}
        <group ref={recordRef} position={[PLATTER.x, RECORD_Y, PLATTER.z]}>
          <group ref={recordTilt}>
            <group ref={recordFlip}>
              <group ref={recordSpin}>
                <mesh geometry={geo.vinylFace} position={[0, VINYL.thickness / 2, 0]} material={mats.vinyl} castShadow={castsArm} receiveShadow />
                <mesh geometry={geo.vinylFace} position={[0, -VINYL.thickness / 2, 0]} rotation={[Math.PI, 0, 0]} material={mats.vinyl} receiveShadow />
                <mesh geometry={geo.edge} material={mats.vinylEdge} />
                <mesh geometry={geo.label} position={[0, VINYL.thickness / 2 + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.labelA} receiveShadow />
                <mesh geometry={geo.label} position={[0, -VINYL.thickness / 2 - 0.0008, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.labelB} receiveShadow />
              </group>
            </group>
          </group>
        </group>

        <Tonearm mats={mats} yawRef={armYaw} pitchRef={armPitch} cast={castsArm} />

        {/* Baked once: a soft contact shadow under the plinth grounds it in the room. */}
        <ContactShadows position={CONTACT_POS} scale={CONTACT_SCALE} far={1.2} blur={2.6} opacity={0.85} resolution={256} frames={1} color="#000000" />
      </group>
    </group>
  );
});

function Feet({ mats }: { mats: Materials }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    [
      [-2.05, 1.5],
      [2.05, 1.5],
      [-2.05, -1.5],
      [2.05, -1.5],
    ].forEach(([x, z], i) => {
      o.position.set(x, -0.56, z);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    invalidate();
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 4]} material={mats.goldSatin}>
      <cylinderGeometry args={[0.24, 0.27, 0.12, 40]} />
    </instancedMesh>
  );
}

/** Start/stop and the two speed buttons: one instanced draw. */
function Controls({ mats }: { mats: Materials }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    [
      [-2.05, 1.42, 1.25],
      [-1.62, 1.5, 0.8],
      [-1.32, 1.5, 0.8],
    ].forEach(([x, z, s], i) => {
      o.position.set(x, 0.012, z);
      o.scale.set(s, 1, s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    invalidate();
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 3]} material={mats.gold}>
      <cylinderGeometry args={[0.1, 0.105, 0.03, 40]} />
    </instancedMesh>
  );
}

function Tonearm({
  mats,
  yawRef,
  pitchRef,
  cast,
}: {
  mats: Materials;
  yawRef: React.RefObject<THREE.Group | null>;
  pitchRef: React.RefObject<THREE.Group | null>;
  cast: boolean;
}) {
  return (
    <group>
      {/* Base and pivot post */}
      <mesh position={[PIVOT.x, 0.025, PIVOT.z]} material={mats.alu} receiveShadow>
        <cylinderGeometry args={[0.34, 0.36, 0.05, 64]} />
      </mesh>
      <mesh position={[PIVOT.x, 0.052, PIVOT.z]} material={mats.gold}>
        <torusGeometry args={[0.345, 0.008, 8, 72]} />
      </mesh>
      <mesh position={[PIVOT.x, 0.19, PIVOT.z]} material={mats.chrome} castShadow={cast}>
        <cylinderGeometry args={[0.065, 0.075, 0.28, 32]} />
      </mesh>
      {/* Arm rest */}
      <mesh position={[PIVOT.x + 0.13, 0.15, PIVOT.z + 1.62]} material={mats.goldSatin} castShadow={cast}>
        <cylinderGeometry args={[0.028, 0.032, 0.3, 20]} />
      </mesh>
      <mesh position={[PIVOT.x + 0.08, 0.305, PIVOT.z + 1.62]} material={mats.rubber}>
        <boxGeometry args={[0.16, 0.03, 0.06]} />
      </mesh>

      <group ref={yawRef} position={[PIVOT.x, ARM_Y, PIVOT.z]}>
        {/* Gimbal */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={mats.gold} castShadow={cast}>
          <cylinderGeometry args={[0.095, 0.095, 0.2, 32]} />
        </mesh>
        <group ref={pitchRef}>
          {/* Arm tube */}
          <mesh position={[0, 0, TUBE_END / 2 - 0.1]} rotation={[Math.PI / 2, 0, 0]} material={mats.gold} castShadow={cast}>
            <cylinderGeometry args={[0.021, 0.024, TUBE_END + 0.2, 20]} />
          </mesh>
          {/* Counterweight with a lacquer band */}
          <mesh position={[0, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]} material={mats.goldSatin} castShadow={cast}>
            <cylinderGeometry args={[0.125, 0.125, 0.26, 40]} />
          </mesh>
          <mesh position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]} material={mats.lacquer}>
            <cylinderGeometry args={[0.13, 0.13, 0.035, 40]} />
          </mesh>
          {/* Headshell, cartridge, stylus, finger lift */}
          <group position={[0, 0, TUBE_END]} rotation={[0, HEADSHELL_OFFSET, 0]}>
            <mesh position={[0, -0.026, 0.13]} material={mats.gold} castShadow={cast}>
              <boxGeometry args={[0.15, 0.018, 0.34]} />
            </mesh>
            <mesh position={[0, -0.072, 0.16]} material={mats.lacquer} castShadow={cast}>
              <boxGeometry args={[0.095, 0.075, 0.16]} />
            </mesh>
            <mesh position={[0, -0.12, 0.22]} material={mats.chrome}>
              <boxGeometry args={[0.012, 0.03, 0.012]} />
            </mesh>
            <mesh position={[0.11, -0.02, 0.24]} rotation={[0, 0, Math.PI / 2]} material={mats.gold}>
              <cylinderGeometry args={[0.009, 0.009, 0.13, 10]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
