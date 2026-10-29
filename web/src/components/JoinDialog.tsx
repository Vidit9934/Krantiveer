import { useEffect, useId, useState } from "react";
import type { FormEvent } from "react";
import { site } from "../data/site";
import type { JoinPrefill } from "../context/JoinContext";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface JoinDialogProps {
  open: boolean;
  prefill: JoinPrefill;
  onClose: () => void;
}

const languages = ["Hindi", "Punjabi", "Haryanvi", "Bhojpuri", "Devotional", "Other"];
const goals = ["More streams", "Playlist reach", "Reels and creators", "Release plan", "Not sure yet"];

interface Values {
  name: string;
  phone: string;
  link: string;
  language: string;
  goal: string;
}
type Errors = Partial<Record<keyof Values, string>>;

const linkPattern = /(spotify\.com|spotify\.link|youtube\.com|youtu\.be|instagram\.com|music\.apple\.com|jiosaavn\.com|gaana\.com)/i;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your name or artist name.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) e.phone = "Enter a WhatsApp number with 10 digits.";
  if (!linkPattern.test(v.link)) e.link = "Paste a Spotify, YouTube or Instagram link.";
  return e;
}

/**
 * The 60-second enrollment form. Nothing is stored or sent: on success the details are
 * handed to WhatsApp as a prefilled message the artist chooses to send.
 */
export function JoinDialog({ open, prefill, onClose }: JoinDialogProps) {
  const uid = useId();
  const [values, setValues] = useState<Values>({ name: "", phone: "", link: "", language: "", goal: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues((v) => ({ ...v, link: prefill.link ?? v.link, language: prefill.language ?? v.language, goal: prefill.goal ?? v.goal }));
    setErrors({});
    setDone(false);
  }, [open, prefill]);

  const set = (key: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) setDone(true);
    else document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus();
  };

  const message = [
    `Hi KMF, I want to join.`,
    `Name: ${values.name.trim()}`,
    `Link: ${values.link.trim()}`,
    values.language && `Language: ${values.language}`,
    values.goal && `Goal: ${values.goal}`,
    prefill.note && `Interested in: ${prefill.note}`,
  ]
    .filter(Boolean)
    .join("\n");
  const waLink = `https://wa.me/${site.whatsappLink.split("/").pop()}?text=${encodeURIComponent(message)}`;

  const chips = (key: "language" | "goal", items: string[], label: string) => (
    <fieldset className="field">
      <legend>{label}</legend>
      <div className="chips" role="radiogroup" aria-label={label}>
        {items.map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={values[key] === item}
            className="chip"
            onClick={() => set(key, values[key] === item ? "" : item)}
          >
            {item}
          </button>
        ))}
      </div>
    </fieldset>
  );

  const fieldProps = (key: keyof Values) => ({
    id: `${uid}-${key}`,
    className: "input",
    value: values[key],
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-err` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.value),
  });
  const err = (key: keyof Values) =>
    errors[key] ? (
      <span id={`${uid}-${key}-err`} className="field__error" role="alert">
        {errors[key]}
      </span>
    ) : null;

  return (
    <Modal open={open} onClose={onClose} labelledBy={`${uid}-title`}>
      {done ? (
        <div className="stack" aria-live="polite">
          <h2 id={`${uid}-title`}>Almost there, {values.name.trim().split(" ")[0]}.</h2>
          <p className="muted">Nothing has been sent yet. Send your details on WhatsApp and a KMF manager replies with a plan for your release.</p>
          <Button href={waLink} external icon="whatsapp" block data-autofocus>
            Send on WhatsApp
          </Button>
          <Button variant="quiet" block onClick={onClose}>
            Back to the site
          </Button>
        </div>
      ) : (
        <form className="stack" onSubmit={submit} noValidate>
          <div>
            <p className="mono dialog__cat" aria-hidden="true">KMF-001 · Side A · 60 seconds</p>
            <h2 id={`${uid}-title`}>Join KMF</h2>
            <p className="muted">Sixty seconds. Nothing is saved on this page.</p>
          </div>
          <div className="form-grid form-grid--2">
            <div className="field">
              <label htmlFor={`${uid}-name`}>Name</label>
              <input {...fieldProps("name")} autoComplete="name" data-autofocus />
              {err("name")}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-phone`}>WhatsApp number</label>
              <input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" />
              {err("phone")}
            </div>
          </div>
          <div className="field">
            <label htmlFor={`${uid}-link`}>Your Spotify, YouTube or Instagram link</label>
            <input {...fieldProps("link")} type="url" inputMode="url" placeholder="https://" />
            {err("link")}
          </div>
          {chips("language", languages, "Language you sing in")}
          {chips("goal", goals, "What you want most")}
          <Button iconAfter="arrow" block type="submit">
            Join KMF
          </Button>
        </form>
      )}
    </Modal>
  );
}
