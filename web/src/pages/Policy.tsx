import { PageHead } from "../components/PageHead";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import type { IconName } from "../components/Icon";

const rules: { icon: IconName; title: string; body: string }[] = [
  { icon: "eye", title: "Creators are vetted, not counted", body: "A manager reviews audience-insight screenshots and sample reels before a creator goes live. Follower count alone never qualifies anyone." },
  { icon: "shield", title: "No purchased plays, ever", body: "KMF does not buy streams, views, followers or playlist spots from farms. If a result cannot be explained by real people, it is not delivered." },
  { icon: "doc", title: "Everything is on the record", body: "Every price and status change is written to an audit log. Reports show where listeners came from, as far as each platform allows." },
  { icon: "lock", title: "Disputes freeze payouts", body: "If a label raises a problem, the creator's payout is held until KMF resolves it. Nobody gets paid for work that was removed or faked." },
];

export default function Policy() {
  return (
    <>
      <PageHead title="No bots. No fake streams." lede="Fake plays get artists flagged. Here is how KMF stays clean." />
      <div className="wrap section--tight stack--lg">
        <ul className="rule-list">
          {rules.map((r) => (
            <li key={r.title}>
              <Icon name={r.icon} size={24} />
              <div>
                <h2>{r.title}</h2>
                <p>{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="notice stack">
          <p>
            <strong>What we cannot promise.</strong> Platforms do not hand outside tools per-artist stream numbers, so Spotify figures in your reports come from your own Spotify for Artists export. We say so in every report.
          </p>
        </div>
        <div className="row">
          <Button to="/plans" iconAfter="arrow">
            Plan my release
          </Button>
          <Button to="/contact" variant="secondary">
            Ask a question about the policy
          </Button>
        </div>
      </div>
    </>
  );
}
