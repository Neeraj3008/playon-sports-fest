import { useEffect, useState } from "react";
import useEvents from "../useEvents.js";
import { useToast } from "../components/Toast.jsx";
import { api } from "../api.js";

export default function Admin() {
  const { events, reload } = useEvents();
  const toast = useToast();
  const [teams, setTeams] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("");
  const [tab, setTab] = useState("teams");

  // Re-fetch teams whenever the search box or sport filter changes (debounced 300 ms)
  useEffect(() => {
    const id = setTimeout(() => {
      const q = new URLSearchParams({ search, sport }).toString();
      api(`/teams?${q}`).then(setTeams).catch((e) => toast(e.message, "danger"));
    }, 300);
    return () => clearTimeout(id);
  }, [search, sport, toast]);

  useEffect(() => {
    api("/feedback").then(setFeedback).catch(() => {});
  }, []);

  async function approve(id) {
    const t = await api(`/teams/${id}/approve`, { method: "PATCH" });
    setTeams((all) => all.map((x) => (x._id === id ? t : x)));
    toast(`${t.teamName} approved`);
  }

  async function remove(t) {
    if (!window.confirm(`Delete team "${t.teamName}"? This cannot be undone.`)) return;
    await api(`/teams/${t._id}`, { method: "DELETE" });
    setTeams((all) => all.filter((x) => x._id !== t._id));
    reload();
    toast("Team deleted", "secondary");
  }

  const pending = teams.filter((t) => t.status === "pending").length;
  const avg = feedback.length ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : "—";

  return (
    <div className="container py-5">
      <p className="eyebrow mb-1">Organiser</p>
      <h1 className="section-title mb-4">Dashboard</h1>

      <div className="row g-3 mb-4">
        {[
          ["Total teams", events.reduce((s, e) => s + e.registered, 0)],
          ["Pending approval", pending],
          ["Feedback received", feedback.length],
          ["Average rating", avg],
        ].map(([l, v]) => (
          <div className="col-6 col-lg-3" key={l}>
            <div className="card kpi border-0 shadow-sm p-3"><div className="kpi-num">{v}</div><div className="small text-muted">{l}</div></div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4">
        <h2 className="h6 fw-bold mb-3">Slots filled per event</h2>
        {events.map((e) => (
          <div className="d-flex align-items-center gap-3 mb-2" key={e._id}>
            <span className="small" style={{ width: 170 }}>{e.icon} {e.title}</span>
            <div className="progress flex-grow-1" style={{ height: 10 }}>
              <div className="progress-bar bg-navy" style={{ width: `${(e.registered / e.maxTeams) * 100}%` }} />
            </div>
            <span className="small text-muted" style={{ width: 50 }}>{e.registered}/{e.maxTeams}</span>
          </div>
        ))}
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${tab === "teams" ? "active" : ""}`} onClick={() => setTab("teams")}>Teams</button></li>
        <li className="nav-item"><button className={`nav-link ${tab === "feedback" ? "active" : ""}`} onClick={() => setTab("feedback")}>Feedback</button></li>
      </ul>

      {tab === "teams" ? (
        <>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <input className="form-control w-auto flex-grow-1" placeholder="Search team or captain…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="form-select w-auto" value={sport} onChange={(e) => setSport(e.target.value)}>
              <option value="">All sports</option>
              {events.map((e) => <option key={e.sport} value={e.sport}>{e.title}</option>)}
            </select>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle bg-white shadow-sm">
              <thead className="table-dark">
                <tr><th>Team</th><th>Sport</th><th>Captain</th><th>Contact</th><th>Players</th><th>Status</th><th className="text-end">Actions</th></tr>
              </thead>
              <tbody>
                {teams.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No teams found</td></tr>}
                {teams.map((t) => (
                  <tr key={t._id}>
                    <td className="fw-semibold">{t.teamName}</td>
                    <td className="text-capitalize">{t.sport.replace("-", " ")}</td>
                    <td>{t.captain}</td>
                    <td>{t.contact}</td>
                    <td className="small">{t.players.join(", ") || "—"}</td>
                    <td><span className={`badge ${t.status === "approved" ? "text-bg-success" : "text-bg-warning"}`}>{t.status}</span></td>
                    <td className="text-end text-nowrap">
                      {t.status === "pending" && <button className="btn btn-sm btn-success me-2" onClick={() => approve(t._id)}>Approve</button>}
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(t)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="row g-3">
          {feedback.length === 0 && <p className="text-muted">No feedback yet.</p>}
          {feedback.map((f) => (
            <div className="col-md-6" key={f._id}>
              <div className="card border-0 shadow-sm p-3 h-100">
                <div className="d-flex justify-content-between"><strong>{f.name}</strong><span className="text-warning">{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</span></div>
                <div className="small text-muted mb-2">{f.email} · {new Date(f.createdAt).toLocaleDateString("en-IN")}</div>
                <p className="mb-0">{f.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
