// Server-side validation (the same rules are also checked in the React forms).
// Never trust the browser alone: anyone can bypass client-side checks.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[6-9]\d{9}$/; // Indian 10-digit mobile number
export const NAME_RE = /^[A-Za-z][A-Za-z .'-]{2,49}$/;

export function validateSignup({ name, email, phone, password }) {
  const errors = {};
  if (!name || !NAME_RE.test(name.trim())) errors.name = "Name must be 3-50 letters";
  if (!email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  if (!phone || !PHONE_RE.test(phone)) errors.phone = "Enter a valid 10-digit mobile number";
  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password))
    errors.password = "Password needs 8+ characters, one capital letter and one number";
  return errors;
}

export function validateTeam({ teamName, sport, captain, contact, players }, event) {
  const errors = {};
  if (!teamName || teamName.trim().length < 3 || teamName.trim().length > 30)
    errors.teamName = "Team name must be 3-30 characters";
  if (!event) errors.sport = "Select a valid sport";
  if (!captain || !NAME_RE.test(captain.trim())) errors.captain = "Enter the captain's full name";
  if (!contact || !PHONE_RE.test(contact)) errors.contact = "Enter a valid 10-digit mobile number";
  if (event) {
    const list = Array.isArray(players) ? players.map((p) => String(p).trim()) : [];
    const needed = event.teamSize - 1; // captain counts as one player
    if (list.length !== needed || list.some((p) => !NAME_RE.test(p)))
      errors.players = `${event.title} needs exactly ${needed} other player name(s)`;
    const all = [captain, ...list].map((p) => String(p || "").trim().toLowerCase());
    if (new Set(all).size !== all.length) errors.players = "Player names must not repeat";
  }
  return errors;
}

export function validateFeedback({ name, email, rating, message }) {
  const errors = {};
  if (!name || !NAME_RE.test(name.trim())) errors.name = "Enter your name";
  if (!email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) errors.rating = "Pick a rating from 1 to 5";
  if (!message || message.trim().length < 20 || message.trim().length > 500)
    errors.message = "Message must be 20-500 characters";
  return errors;
}
