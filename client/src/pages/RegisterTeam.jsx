import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Field from "../components/Field.jsx";
import { fmtDate } from "../components/EventCard.jsx";
import useEvents from "../useEvents.js";
import { useAuth } from "../AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";
import { api } from "../api.js";
import { validateTeam } from "../validation.js";

/* FORM 2: Team registration */
export default function RegisterTeam() {
  const { events } = useEvents();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [values, setValues] = useState({
    teamName: "",
    sport: params.get("sport") || "",
    captain: user?.name || "",
    contact: user?.phone || "",
    players: [],
    agree: false,
  });
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const event = events.find((e) => e.sport === values.sport);
  const errors = { ...validateTeam(values, event), ...serverErrors };

  // When the sport changes, show exactly (teamSize - 1) player boxes
  useEffect(() => {
    if (!event) return;
    setValues((v) => {
      const needed = event.teamSize - 1;
      const players = Array.from({ length: needed }, (_, i) => v.players[i] || "");
      return { ...v, players };
    });
  }, [event?.sport, event?.teamSize]);

  function change(e) {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : name === "contact" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setValues((s) => ({ ...s, [name]: v }));
    setServerErrors(({ [name]: _drop, ...rest }) => rest);
  }
  function changePlayer(i, value) {
    setValues((s) => ({ ...s, players: s.players.map((p, j) => (j === i ? value : p)) }));
    setServerErrors(({ players: _drop, ...rest }) => rest);
  }
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  async function submit(e) {
    e.preventDefault();
    setTouched({ teamName: true, sport: true, captain: true, contact: true, players: true, agree: true });
    if (Object.keys(validateTeam(values, event)).length) return toast("Please fix the highlighted fields", "danger");

    setBusy(true);
    try {
      const team = await api("/teams", { method: "POST", body: values });
      toast(`Team "${team.teamName}" registered for ${event.title}! 🏆`);
      navigate("/my-teams");
    } catch (err) {
      setServerErrors(err.errors || {});
      toast(err.message, "danger");
    } finally {
      setBusy(false);
    }
  }

  const f = (name) => ({ name, value: values[name], onChange: change, onBlur: blur, error: errors[name], touched: touched[name] });

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        <div className="col-lg-7">
          <p className="eyebrow mb-1">Registration</p>
          <h1 className="section-title mb-4">Register your team</h1>
          <form className="card form-card border-0 shadow p-4" noValidate onSubmit={submit}>
            <Field label="Sport" as="select" {...f("sport")}>
              {(state) => (
                <select id="sport" name="sport" className={`form-select${state}`} value={values.sport} onChange={change} onBlur={blur}>
                  <option value="">-- Choose a sport --</option>
                  {events.map((ev) => (
                    <option key={ev.sport} value={ev.sport} disabled={ev.slotsLeft <= 0}>
                      {ev.icon} {ev.title} ({ev.slotsLeft > 0 ? `${ev.slotsLeft} slots left` : "full"})
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label={event?.teamSize === 1 ? "Player / entry name" : "Team name"} placeholder="e.g. Smash Brothers" maxLength={30} hint={`${values.teamName.length}/30`} {...f("teamName")} />

            <div className="row">
              <div className="col-md-6"><Field label={event?.teamSize === 1 ? "Player's full name" : "Captain's full name"} {...f("captain")} /></div>
              <div className="col-md-6"><Field label="Contact number" type="tel" inputMode="numeric" {...f("contact")} /></div>
            </div>

            {event && event.teamSize > 1 && (
              <fieldset className="mb-3">
                <legend className="form-label fw-medium fs-6">Other players ({event.teamSize - 1} required)</legend>
                <div className="row g-2">
                  {values.players.map((p, i) => (
                    <div className="col-md-6" key={i}>
                      <input
                        className={`form-control${touched.players ? (p.trim() && !errors.players ? " is-valid" : errors.players ? " is-invalid" : "") : ""}`}
                        placeholder={`Player ${i + 2}`}
                        value={p}
                        aria-label={`Player ${i + 2} name`}
                        onChange={(e) => changePlayer(i, e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, players: true }))}
                      />
                    </div>
                  ))}
                </div>
                {touched.players && errors.players && <div className="invalid-feedback d-block">{errors.players}</div>}
              </fieldset>
            )}

            <div className="form-check mb-4">
              <input className={`form-check-input${touched.agree ? (errors.agree ? " is-invalid" : " is-valid") : ""}`} type="checkbox" id="agree" name="agree" checked={values.agree} onChange={change} onBlur={blur} />
              <label className="form-check-label" htmlFor="agree">
                I confirm the entry fee {event ? `of ₹${event.entryFee}` : ""} will be paid at the venue and all players accept the rules
              </label>
              {touched.agree && errors.agree && <div className="invalid-feedback">{errors.agree}</div>}
            </div>

            <button className="btn btn-navy btn-lg" disabled={busy}>
              {busy && <span className="spinner-border spinner-border-sm me-2" />}Submit registration
            </button>
          </form>
        </div>

        {/* Live summary card updates as the user types */}
        <div className="col-lg-4">
          <div className="card summary-card border-0 shadow-sm sticky-lg-top" style={{ top: 90 }}>
            <div className="card-body p-4">
              <h2 className="h6 text-uppercase text-white-50 mb-3">Your entry</h2>
              {event ? (
                <>
                  <div className="display-6 mb-1">{event.icon}</div>
                  <h3 className="h4 fw-bold">{event.title}</h3>
                  <p className="small text-white-75 mb-3">{fmtDate(event.date)}<br />{event.venue}</p>
                  <hr className="border-light opacity-25" />
                  <p className="mb-1 fw-semibold">{values.teamName || "Your team name"}</p>
                  <ol className="small ps-3 mb-3">
                    <li>{values.captain || "Captain"} {event.teamSize > 1 && <span className="badge bg-lime text-navy">C</span>}</li>
                    {values.players.map((p, i) => <li key={i} className={p ? "" : "opacity-50"}>{p || `Player ${i + 2}`}</li>)}
                  </ol>
                  <div className="d-flex justify-content-between fw-semibold"><span>Entry fee</span><span>₹{event.entryFee}</span></div>
                </>
              ) : (
                <p className="text-white-75 mb-0">Choose a sport to see your entry summary.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
