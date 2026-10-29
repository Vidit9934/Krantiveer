import * as THREE from "three";
import { makeGrooveMaps, makeLabel, makeStrobeMap } from "./textures";

export type Quality = "full" | "light";

/**
 * Shared materials. One instance each, reused by every mesh that needs it, and disposed by
 * hand (with their generated textures) when the stage unmounts.
 */
export function createMaterials(quality: Quality, maxAniso: number) {
  const full = quality === "full";
  const grooves = makeGrooveMaps(full ? 2048 : 1024, maxAniso);
  const strobe = makeStrobeMap(maxAniso);
  const labelSize = full ? 1024 : 512;
  const labelA = makeLabel({ side: "a", title: "KMF", caption: "KMF MEDIA   SIDE A   KMF-001   STEREO   33 1/3 RPM", catalogue: "KMF-001" }, labelSize, maxAniso);
  const labelB = makeLabel({ side: "b", title: "KMF", caption: "KMF MEDIA   SIDE B   KMF-002   STEREO   33 1/3 RPM", catalogue: "KMF-002" }, labelSize, maxAniso);

  const vinyl = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#040404"),
    roughness: 0.26,
    metalness: 0,
    normalMap: grooves.normal,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughnessMap: grooves.rough,
    // Low on purpose: higher values smear the key light's highlight across the whole disc.
    anisotropy: 0.2,
    anisotropyMap: grooves.aniso,
    specularIntensity: 0.55,
    ior: 1.5,
    envMapIntensity: 0.4,
  });

  const vinylEdge = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#070707"),
    roughness: 0.22,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
  });

  const labelMat = (l: { map: THREE.Texture; mask: THREE.Texture }) =>
    new THREE.MeshPhysicalMaterial({
      map: l.map,
      roughness: 1,
      metalness: 1,
      roughnessMap: l.mask,
      metalnessMap: l.mask,
      clearcoat: 0.15,
      clearcoatRoughness: 0.3,
    });

  const goldColour = new THREE.Color("#d2ab5a");
  const gold = new THREE.MeshPhysicalMaterial({
    color: goldColour,
    metalness: 1,
    roughness: 0.24,
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
  });
  const goldSatin = new THREE.MeshPhysicalMaterial({ color: goldColour, metalness: 1, roughness: 0.42 });

  const lacquer = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#050404"),
    roughness: 0.34,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    specularIntensity: 0.45,
  });

  const alu = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#2c2a27"),
    metalness: 1,
    roughness: 0.38,
    anisotropy: 0.6,
    envMapIntensity: 0.55,
  });
  const strobeMat = new THREE.MeshPhysicalMaterial({
    map: strobe,
    metalness: 1,
    roughness: 0.26,
    color: new THREE.Color("#b8b2a8"),
  });
  const chrome = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#c9c4bb"), metalness: 1, roughness: 0.12 });
  const rubber = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#0b0a09"), roughness: 0.85 });

  const mats = {
    vinyl,
    vinylEdge,
    labelA: labelMat(labelA),
    labelB: labelMat(labelB),
    gold,
    goldSatin,
    lacquer,
    alu,
    strobe: strobeMat,
    chrome,
    rubber,
  };

  const textures = [grooves.normal, grooves.rough, grooves.aniso, strobe, labelA.map, labelA.mask, labelB.map, labelB.mask];
  const dispose = () => {
    Object.values(mats).forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  };
  return { ...mats, dispose };
}

export type Materials = ReturnType<typeof createMaterials>;
