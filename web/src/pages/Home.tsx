import { usePageTitle } from "../components/PageHead";
import { Button } from "../components/Button";
import { useJoin } from "../context/JoinContext";
import { useSide } from "../context/SideContext";
import { Hero } from "./home/Hero";
import { Statement } from "./home/Statement";
import { Path } from "./home/Path";
import { Proof } from "./home/Proof";
import { Results } from "./home/Results";
import { ServicesList } from "./home/ServicesList";
import { WorkBands } from "./home/WorkBands";
import { Reel } from "./home/Reel";
import { DepthCard } from "./home/DepthCard";
import { RegionMap } from "./home/RegionMap";
import { Estimator } from "./home/Estimator";
import { Voices } from "./home/Voices";
import { Faq } from "./home/Faq";
import { Close } from "./home/Close";
import { Ticker } from "./home/Ticker";
import { Scene3D } from "../components/Scene3D";

const dream = {
  a: "From a bedroom demo to a stage, a playlist, a name people sing back.",
  b: "From a brief to a campaign you can check, creator by creator.",
};
const promise = {
  a: "Real listeners only. No bots. No fake streams.",
  b: "Creators you can verify. Prices only we see.",
};

const trustFacts = [
  "A manager approves every creator after reviewing audience screenshots.",
  "Every price and status change is logged.",
  "A dispute freezes the payout until it is settled.",
];

/** Dark scenes are the listening room; Path, Proof, Results, Estimator and FAQ are paper. The journey, staged around the 3D turntable fixed behind it (six beats, see DESIGN.md): promise, dream, path, proof, results, releases, doors, trust, estimator, voices, answers, close. */
export default function Home() {
  usePageTitle("KMF Media");
  const { openJoin } = useJoin();
  const { side } = useSide();
  return (
    <>
      <Scene3D />
      <Hero />
      <Statement text={dream} label="The dream" beat={2} aside={<DepthCard />}>
        {side === "a" ? (
          <Button onClick={() => openJoin()} magnetic cursor="Join" iconAfter="arrow">
            Join KMF
          </Button>
        ) : (
          <Button to="/marketplace/campaigns/new" magnetic cursor="Go" iconAfter="arrow">
            Post a campaign
          </Button>
        )}
      </Statement>
      <Ticker />
      <ServicesList />
      <WorkBands />
      <Reel />
      <Results />
      <Proof />
      <Path />
      <RegionMap />
      <Statement text={promise} label="Our promise">
        <ul className="facts">
          {trustFacts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <Button to="/policy" variant="quiet" magnetic cursor="Open">
          Read the policy
        </Button>
      </Statement>
      <Estimator />
      <Voices />
      <Faq />
      <Close />
    </>
  );
}
