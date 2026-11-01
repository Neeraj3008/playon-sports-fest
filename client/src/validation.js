// Client-side validation rules (mirrors server/validators.js)
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[6-9]\d{9}$/;
export const NAME_RE = /^[A-Za-z][A-Za-z .'-]{2,49}$/;

export function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

export function validateSignup(v) {
  const e = {};
  if (!NAME_RE.test(v.name.trim())) e.name = "Name must be 3-50 letters";
  if (!EMAIL_RE.test(v.email)) e.email = "Enter a valid email address";
  if (!PHONE_RE.test(v.phone)) e.phone = "Enter a valid 10-digit mobile number starting with 6-9";
  if (v.password.length < 8 || !/[A-Z]/.test(v.password) || !/\d/.test(v.password))
    e.password = "Use 8+ characters with one capital letter and one number";
  if (v.confirm !== v.password) e.confirm = "Passwords do not match";
  if (!v.agree) e.agree = "You must accept the rules";
  return e;
}

export function validateLogin(v) {
  const e = {};
  if (!EMAIL_RE.test(v.email)) e.email = "Enter a valid email address";
  if (!v.password) e.password = "Enter your password";
  return e;
}

export function validateTeam(v, event) {
  const e = {};
  if (v.teamName.trim().length < 3 || v.teamName.trim().length > 30) e.teamName = "Team name must be 3-30 characters";
  if (!event) e.sport = "Choose a sport";
  if (!NAME_RE.test(v.captain.trim())) e.captain = "Enter the captain's full name";
  if (!PHONE_RE.test(v.contact)) e.contact = "Enter a valid 10-digit mobile number";
  if (event) {
    if (v.players.some((p) => !NAME_RE.test(p.trim()))) e.players = "Fill in every player's name (letters only)";
    const all = [v.captain, ...v.players].map((p) => p.trim().toLowerCase()).filter(Boolean);
    if (new Set(all).size !== all.length) e.players = "Player names must not repeat";
    if (event.slotsLeft <= 0) e.sport = "This event is full";
  }
  if (!v.agree) e.agree = "Please confirm the fee and rules";
  return e;
}

export function validateFeedback(v) {
  const e = {};
  if (!NAME_RE.test(v.name.trim())) e.name = "Enter your name";
  if (!EMAIL_RE.test(v.email)) e.email = "Enter a valid email address";
  if (!v.rating) e.rating = "Pick a star rating";
  if (v.message.trim().length < 20) e.message = "Write at least 20 characters";
  if (v.message.length > 500) e.message = "Keep it under 500 characters";
  return e;
}
