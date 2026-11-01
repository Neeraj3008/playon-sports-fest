import { useState } from "react";
import Field from "../components/Field.jsx";
import { useAuth } from "../AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";
import { api } from "../api.js";
import { validateFeedback } from "../validation.js";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/* FORM 3: Feedback / Contact */
export default function Feedback() {
  const { user } = useAuth();
  const toast = useToast();
  const blank = { name: user?.name || "", email: user?.email || "", rating: 0, message: "" };
  const [values, setValues] = useState(blank);
  const [hover, setHover] = useState(0);
  const [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const errors = validateFeedback(values);
  const change = (e) => setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  async function submit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, rating: true, message: true });
    if (Object.keys(errors).length) return toast("Please fix the highlighted fields", "danger");
    setBusy(true);
    try {
      await api("/feedback", { method: "POST", body: values });
      toast("Thanks for your feedback! 💚");
      setSent(true);
      setValues(blank);
      setTouched({});
    } catch (err) {
      toast(err.message, "danger");
    } finally {
      setBusy(false);
    }
  }

  const f = (name) => ({ name, value: values[name], onChange: change, onBlur: blur, error: errors[name], touched: touched[name] });

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <p className="eyebrow mb-1">Get in touch</p>
      <h1 className="section-title mb-2">Feedback &amp; contact</h1>
      <p className="text-muted mb-4">Tell us how registration went, report a problem, or ask the organisers anything.</p>

      {sent && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          Your message reached the organisers.
          <button className="btn btn-sm btn-outline-success" onClick={() => setSent(false)}>Send another</button>
        </div>
      )}

      <form className="card form-card border-0 shadow p-4" noValidate onSubmit={submit}>
        <div className="row">
          <div className="col-md-6"><Field label="Name" {...f("name")} /></div>
          <div className="col-md-6"><Field label="Email" type="email" {...f("email")} /></div>
        </div>

        <div className="mb-3">
          <span className="form-label fw-medium d-block">Rate your experience</span>
          <div className="stars" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                role="radio"
                aria-checked={values.rating === n}
                aria-label={`${n} star`}
                className={`star ${(hover || values.rating) >= n ? "on" : ""}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => {
                  setValues((s) => ({ ...s, rating: n }));
                  setTouched((t) => ({ ...t, rating: true }));
                }}
              >
                ★
              </button>
            ))}
            <span className="ms-2 small text-muted">{LABELS[hover || values.rating]}</span>
          </div>
          {touched.rating && errors.rating && <div className="invalid-feedback d-block">{errors.rating}</div>}
        </div>

        <Field label="Message" as="textarea" rows={5} maxLength={500} placeholder="At least 20 characters…" hint={`${values.message.length}/500 characters`} {...f("message")} />

        <button className="btn btn-navy btn-lg" disabled={busy}>
          {busy && <span className="spinner-border spinner-border-sm me-2" />}Send feedback
        </button>
      </form>
    </div>
  );
}
