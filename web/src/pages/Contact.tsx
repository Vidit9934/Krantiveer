import { PaperScene } from "../motion/PaperScene";
import { useState } from "react";
import type { FormEvent } from "react";
import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { site } from "../data/site";

interface Errors {
  name?: string;
  contact?: string;
  message?: string;
}

export default function Contact() {
  const [values, setValues] = useState({ name: "", contact: "", role: "Artist", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(values.contact) && !/^[+]?\d[\d\s-]{8,}$/.test(values.contact)) next.contact = "Enter an email or a phone number we can reach.";
    if (values.message.trim().length < 10) next.message = "A sentence or two about your release helps us reply properly.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  return (
    <>
      <PageHead title="Talk to the KMF team" lede="Tell us about your release. WhatsApp is quickest." />
      <PaperScene className="scene-paper" aria-label="Contact form">
      <div className="wrap grid grid--sidebar">
        {sent ? (
          <div className="panel stack" role="status">
            <h2>Message noted</h2>
            <p className="muted">This is a front-end preview, so nothing was sent. On the live site a manager replies within one working day, usually sooner on WhatsApp.</p>
            <Button variant="secondary" onClick={() => setSent(false)}>
              Write another message
            </Button>
          </div>
        ) : (
          <form className="panel form-grid" onSubmit={submit} noValidate>
            <div className="form-grid form-grid--2">
              <div className="field">
                <label htmlFor="c-name">Your name</label>
                <input id="c-name" className="input" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby="c-name-e" autoComplete="name" />
                <small id="c-name-e" className="field__error">{errors.name}</small>
              </div>
              <div className="field">
                <label htmlFor="c-role">I am a</label>
                <select id="c-role" className="select" value={values.role} onChange={(e) => setValues({ ...values, role: e.target.value })}>
                  <option>Artist</option>
                  <option>Label or agency</option>
                  <option>Creator</option>
                  <option>Something else</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="c-contact">Email or phone</label>
              <input id="c-contact" className="input" value={values.contact} onChange={(e) => setValues({ ...values, contact: e.target.value })} aria-invalid={!!errors.contact} aria-describedby="c-contact-e" autoComplete="email" />
              <small id="c-contact-e" className="field__error">{errors.contact}</small>
            </div>
            <div className="field">
              <label htmlFor="c-msg">About your release</label>
              <textarea id="c-msg" className="textarea" value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} aria-invalid={!!errors.message} aria-describedby="c-msg-e" />
              <small id="c-msg-e" className="field__error">{errors.message}</small>
            </div>
            <div>
              <Button icon="mic" onClick={() => document.getElementById("contact-submit")?.click()}>
                Send to the KMF team
              </Button>
              <button id="contact-submit" type="submit" hidden />
            </div>
          </form>
        )}
        <aside className="stack">
          <a className="wa-card" href={site.whatsappLink} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={30} />
            <span>
              <strong>Chat on WhatsApp</strong>
              <small>{site.whatsappDisplay}, usually replies within an hour</small>
            </span>
          </a>
          <p className="muted small">Email: {site.email} <span className="ph">placeholder</span></p>
        </aside>
      </div>
      </PaperScene>
    </>
  );
}
