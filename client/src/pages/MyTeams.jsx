import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function MyTeams() {
  const [teams, setTeams] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/teams/mine").then(setTeams).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container py-5" style={{ maxWidth: 860 }}>
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <p className="eyebrow mb-1">Your entries</p>
          <h1 className="section-title mb-0">My teams</h1>
        </div>
        <Link to="/register" className="btn btn-navy">+ Register another</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!teams ? (
        <div className="text-center py-5"><div className="spinner-border text-navy" role="status" /></div>
      ) : teams.length === 0 ? (
        <div className="text-center text-muted py-5">You haven't registered any teams yet.</div>
      ) : (
        <div className="list-group shadow-sm">
          {teams.map((t) => (
            <div className="list-group-item p-3 d-flex justify-content-between align-items-center" key={t._id}>
              <div>
                <div className="fw-bold">{t.teamName}</div>
                <div className="small text-muted text-capitalize">{t.sport.replace("-", " ")} · {[t.captain, ...t.players].join(", ")}</div>
              </div>
              <span className={`badge ${t.status === "approved" ? "text-bg-success" : "text-bg-warning"}`}>
                {t.status === "approved" ? "Approved" : "Pending approval"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
