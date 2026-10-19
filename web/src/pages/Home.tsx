import { usePageTitle } from "../components/PageHead";
import { Button } from "../components/Button";
import { useJoin } from "../context/JoinContext";
import { useSide } from "../context/SideContext";
import { Hero } from "./home/Hero";
import { Statement } from "./home/Statement";
import { Path } from "./home/Path";
import { Proof } from "./home/Proof";
import { Results } from "./home/Results";
import { Releases } from "./home/Releases";
import { Doors } from "./home/Doors";
import { Estimator } from "./home/Estimator";
import { Voices } from "./home/Voices";
import { Faq } from "./home/Faq";
import { Close } from "./home/Close";

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

/** The journey: promise, dream, path, proof, results, releases, doors, trust, estimator, voices, answers, close. */
export default function Home() {
  usePageTitle("KMF Media");
  const { openJoin } = useJoin();
  const { side } = useSide();
  return (
    <>
      <Hero />
      <Statement text={dream} label="The dream">
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
      <Path />
      <Proof />
      <Results />
      <Releases />
      <Doors />
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
