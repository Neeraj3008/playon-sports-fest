import { useState } from "react";
import EventCard from "../components/EventCard.jsx";
import useEvents from "../useEvents.js";

export default function Events() {
  const { events, loading, error } = useEvents();
  const [filter, setFilter] = useState("all");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sort, setSort] = useState("date");

  const days = [...new Set(events.map((e) => new Date(e.date).toDateString()))];
  let shown = events.filter(
    (e) => (filter === "all" || new Date(e.date).toDateString() === filter) && (!onlyOpen || e.slotsLeft > 0)
  );
  shown = [...shown].sort((a, b) =>
    sort === "fee" ? a.entryFee - b.entryFee : sort === "slots" ? b.slotsLeft - a.slotsLeft : new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="container py-5">
      <p className="eyebrow mb-1">PlayOn 2027</p>
      <h1 className="section-title mb-4">All events</h1>

      <div className="filter-bar d-flex flex-wrap gap-3 align-items-center mb-4 p-3">
        <div className="btn-group flex-wrap" role="group" aria-label="Filter by day">
          <button className={`btn btn-sm ${filter === "all" ? "btn-navy" : "btn-outline-navy"}`} onClick={() => setFilter("all")}>All days</button>
          {days.map((d) => (
            <button key={d} className={`btn btn-sm ${filter === d ? "btn-navy" : "btn-outline-navy"}`} onClick={() => setFilter(d)}>
              {new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </button>
          ))}
        </div>
        <div className="form-check form-switch mb-0">
          <input className="form-check-input" type="checkbox" id="open" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
          <label className="form-check-label" htmlFor="open">Only show open events</label>
        </div>
        <select className="form-select form-select-sm w-auto ms-md-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort events">
          <option value="date">Sort by date</option>
          <option value="fee">Sort by entry fee</option>
          <option value="slots">Sort by slots left</option>
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-navy" role="status" /></div>
      ) : shown.length === 0 ? (
        <p className="text-muted">No events match these filters.</p>
      ) : (
        <div className="row g-4">
          {shown.map((ev) => (
            <div className="col-md-6 col-lg-4" key={ev._id}><EventCard ev={ev} /></div>
          ))}
        </div>
      )}
    </div>
  );
}
