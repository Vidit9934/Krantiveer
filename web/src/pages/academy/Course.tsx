import { PaperScene } from "../../motion/PaperScene";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageHead } from "../../components/PageHead";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { courses } from "../../data/site";
import { inr } from "../../lib/format";

const lessonTitles = ["Start here: what a release really is", "Your master and your metadata", "Artwork and the first impression", "Pre-save and release-day setup", "Pitching to playlists without bots", "Content for week one", "Reading your numbers", "What to do in week four"];

export default function Course() {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [owned, setOwned] = useState(false);
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState<string[]>([]);

  if (!course) {
    return (
      <>
        <PageHead title="Course not found" lede="That course is not in the Video Academy." />
        <div className="wrap section--tight">
          <Button to="/academy">See all courses</Button>
        </div>
      </>
    );
  }

  const freePreview = 3;
  const unlocked = (i: number) => owned || course.priceInr === null || i < freePreview;
  const pct = Math.round((done.length / lessonTitles.length) * 100);

  return (
    <>
      <PageHead title={course.title} lede={course.summary} />
      <PaperScene className="scene-paper" aria-label="Lessons">
      <div className="wrap grid grid--sidebar">
        <div className="stack--lg">
          <div className="player" aria-label={`Lesson ${current + 1}: ${lessonTitles[current]}`}>
            {unlocked(current) ? (
              <>
                <button type="button" className="player__play" aria-label="Play lesson preview (placeholder video)">
                  <Icon name="play" size={34} />
                </button>
                <p className="player__cap">Placeholder video. Live lessons stream from the video service.</p>
              </>
            ) : (
              <div className="stack" style={{ textAlign: "center", placeItems: "center" }}>
                <Icon name="lock" size={32} />
                <p>This lesson is part of the full course.</p>
                <Button onClick={() => setOwned(true)}>Unlock for {inr(course.priceInr ?? 0)}</Button>
              </div>
            )}
          </div>

          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "1.5rem" }}>{lessonTitles[current]}</h2>
            <Button
              variant="secondary"
              icon="check"
              disabled={!unlocked(current) || done.includes(current)}
              onClick={() => setDone([...done, current])}
            >
              {done.includes(current) ? "Completed" : "Mark lesson complete"}
            </Button>
          </div>

          <section className="stack" aria-labelledby="qa">
            <h2 id="qa" style={{ fontSize: "1.25rem" }}>Questions on this lesson</h2>
            {asked.length === 0 ? <p className="empty">No questions yet. Ask the first one.</p> : <ul className="stack">{asked.map((q, i) => <li key={i} className="panel">{q}</li>)}</ul>}
            <div className="field">
              <label htmlFor="q">Your question</label>
              <textarea id="q" className="textarea" style={{ minHeight: 80 }} value={question} onChange={(e) => setQuestion(e.target.value)} />
            </div>
            <div>
              <Button
                variant="secondary"
                disabled={question.trim().length < 5}
                onClick={() => {
                  setAsked([...asked, question.trim()]);
                  setQuestion("");
                }}
              >
                Post question
              </Button>
            </div>
          </section>
        </div>

        <aside className="panel panel--raised stack" aria-label="Lessons">
          <div>
            <p className="mono muted">{pct}% complete</p>
            <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
              <i style={{ width: `${pct}%` }} />
            </div>
          </div>
          <ol className="lessons">
            {lessonTitles.map((t, i) => (
              <li key={t}>
                <button type="button" aria-current={i === current ? "true" : undefined} onClick={() => setCurrent(i)}>
                  <span>{t}</span>
                  <span className="muted small">
                    {done.includes(i) ? "Done" : !unlocked(i) ? "Locked" : i < freePreview && course.priceInr ? "Free preview" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          {pct === 100 && (
            <p className="notice" role="status">
              Course complete. Your PDF certificate is ready.
            </p>
          )}
        </aside>
      </div>
      </PaperScene>
    </>
  );
}
