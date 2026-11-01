import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Field from "../components/Field.jsx";
import { useAuth } from "../AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";
import { api } from "../api.js";
import { validateSignup, validateLogin, passwordStrength } from "../validation.js";

const EMPTY = { name: "", email: "", phone: "", password: "", confirm: "", agree: false };
const STRENGTH = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["danger", "danger", "warning", "info", "success"];

/* FORM 1: Sign up / Login */
export default function AuthPage() {
  const [mode, setMode] = useState("signup");
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const errors = { ...(mode === "signup" ? validateSignup(values) : validateLogin(values)), ...serverErrors };
  const strength = passwordStrength(values.password);

  function change(e) {
    const { name, value, type, checked } = e.target;
    // phone field: allow digits only, max 10
    const v = type === "checkbox" ? checked : name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setValues((s) => ({ ...s, [name]: v }));
    setServerErrors(({ [name]: _drop, ...rest }) => rest);
  }
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  function switchMode(m) {
    setMode(m);
    setTouched({});
    setServerErrors({});
  }

  async function submit(e) {
    e.preventDefault();
    const fields = mode === "signup" ? Object.keys(EMPTY) : ["email", "password"];
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    const clientErrors = mode === "signup" ? validateSignup(values) : validateLogin(values);
    if (Object.keys(clientErrors).length) return toast("Please fix the highlighted fields", "danger");

    setBusy(true);
    try {
      const data = await api(`/auth/${mode}`, {
        method: "POST",
        body: mode === "signup" ? values : { email: values.email, password: values.password },
      });
      login(data);
      toast(mode === "signup" ? `Welcome to PlayOn, ${data.user.name.split(" ")[0]}! 🎉` : "Logged in successfully");
      navigate(data.user.role === "admin" ? "/admin" : "/register");
    } catch (err) {
      setServerErrors(err.errors || {});
      toast(err.message, "danger");
    } finally {
      setBusy(false);
    }
  }

  const f = (name) => ({ name, value: values[name], onChange: change, onBlur: blur, error: errors[name], touched: touched[name] });

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      {location.state?.needLogin && <div className="alert alert-info">Please log in or sign up to continue.</div>}
      <div className="card form-card border-0 shadow">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <ul className="nav nav-pills nav-fill auth-tabs">
            <li className="nav-item"><button className={`nav-link ${mode === "signup" ? "active" : ""}`} onClick={() => switchMode("signup")}>Sign up</button></li>
            <li className="nav-item"><button className={`nav-link ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")}>Log in</button></li>
          </ul>
        </div>
        <form className="card-body p-4" noValidate onSubmit={submit}>
          {mode === "signup" && <Field label="Full name" placeholder="e.g. Rohan Mehta" autoComplete="name" {...f("name")} />}
          <Field label="Email" type="email" placeholder="you@example.com" autoComplete="email" {...f("email")} />
          {mode === "signup" && (
            <Field label="Mobile number" type="tel" inputMode="numeric" placeholder="10-digit number" hint={`${values.phone.length}/10 digits`} {...f("phone")} />
          )}
          <Field label="Password" {...f("password")}>
            {(state) => (
              <div className="input-group has-validation">
                <input id="password" name="password" type={showPw ? "text" : "password"} className={`form-control${state}`} value={values.password} onChange={change} onBlur={blur} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPw((s) => !s)}>{showPw ? "Hide" : "Show"}</button>
              </div>
            )}
          </Field>
          {mode === "signup" && values.password && (
            <div className="mb-3">
              <div className="progress" style={{ height: 5 }}>
                <div className={`progress-bar bg-${STRENGTH_COLOR[strength]}`} style={{ width: `${(strength / 4) * 100}%` }} />
              </div>
              <small className={`text-${STRENGTH_COLOR[strength]}`}>{STRENGTH[strength]}</small>
            </div>
          )}
          {mode === "signup" && (
            <>
              <Field label="Confirm password" type={showPw ? "text" : "password"} autoComplete="new-password" {...f("confirm")} />
              <div className="form-check mb-3">
                <input className={`form-check-input${touched.agree ? (errors.agree ? " is-invalid" : " is-valid") : ""}`} type="checkbox" id="agree" name="agree" checked={values.agree} onChange={change} onBlur={blur} />
                <label className="form-check-label" htmlFor="agree">I agree to the tournament rules and code of conduct</label>
                {touched.agree && errors.agree && <div className="invalid-feedback">{errors.agree}</div>}
              </div>
            </>
          )}
          <button className="btn btn-navy w-100 py-2" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm me-2" />}
            {mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
