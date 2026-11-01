import { Link } from "react-router-dom";

export const fmtDate = (d) =>
  new Date(d).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function EventCard({ ev }) {
  const pct = Math.round((ev.registered / ev.maxTeams) * 100);
  const full = ev.slotsLeft <= 0;
  return (
    <div className="card event-card h-100 border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="event-icon" aria-hidden="true">{ev.icon}</span>
          <span className={`badge ${full ? "text-bg-danger" : ev.slotsLeft <= 3 ? "text-bg-warning" : "text-bg-success"}`}>
            {full ? "Full" : `${ev.slotsLeft} slots left`}
          </span>
        </div>
        <h3 className="h5 fw-bold mb-1">{ev.title}</h3>
        <p className="text-muted small mb-3">{ev.description}</p>
        <ul className="list-unstyled small mb-3">
          <li>📅 {fmtDate(ev.date)}</li>
          <li>📍 {ev.venue}</li>
          <li>👥 {ev.teamSize === 1 ? "Singles" : `${ev.teamSize} players / team`} · ₹{ev.entryFee}</li>
        </ul>
        <div className="progress mb-3" role="progressbar" aria-label="Slots filled" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" style={{ height: 6 }}>
          <div className="progress-bar bg-lime" style={{ width: `${pct}%` }} />
        </div>
        <Link
          to={`/register?sport=${ev.sport}`}
          className={`btn mt-auto ${full ? "btn-outline-secondary disabled" : "btn-navy"}`}
          aria-disabled={full}
        >
          {full ? "Registrations closed" : "Register now"}
        </Link>
      </div>
    </div>
  );
}
