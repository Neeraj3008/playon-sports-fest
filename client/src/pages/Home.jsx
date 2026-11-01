import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Countdown from "../components/Countdown.jsx";
import EventCard from "../components/EventCard.jsx";
import useEvents from "../useEvents.js";
import { api } from "../api.js";

export default function Home() {
  const { events, loading, error } = useEvents();
  const [rating, setRating] = useState(null);

  useEffect(() => {
    api("/feedback/summary").then(setRating).catch(() => {});
  }, []);

  const next = events.find((e) => new Date(e.date) > Date.now()) || events[0];
  const totalTeams = events.reduce((s, e) => s + e.registered, 0);
  const totalPrize = 150000;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <header className="hero text-white">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill bg-lime text-navy mb-3 px-3 py-2">16–18 January 2027 · Mumbai</span>
              <h1 className="display-title">Five sports.<br />Three days.<br /><span className="text-lime">One champion squad.</span></h1>
              <p className="lead text-white-75 my-4">
                PlayOn Sports Fest brings together college and club teams for pickleball, badminton, box cricket,
                lawn tennis and 5-a-side football. Register your team in under two minutes.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-lime btn-lg px-4">Register your team</Link>
                <Link to="/events" className="btn btn-outline-light btn-lg px-4">View events</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="countdown-card p-4">
                <p className="text-uppercase small fw-semibold text-white-50 mb-1">Next up</p>
                <h2 className="h4 mb-3">{next ? `${next.icon} ${next.title}` : "Loading…"}</h2>
                {next && <Countdown target={next.date} />}
                <p className="small text-white-50 mt-3 mb-0">{next?.venue}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Stats strip ---------- */}
      <section className="stats-strip">
        <div className="container">
          <div className="row text-center g-0">
            {[
              [events.length || 5, "Sports"],
              [totalTeams, "Teams registered"],
              [`₹${(totalPrize / 1000).toFixed(0)}K`, "Prize pool"],
              [rating?.count ? `${rating.average}★` : "—", "Avg. rating"],
            ].map(([v, l]) => (
              <div className="col-6 col-md-3 py-4 stat" key={l}>
                <div className="stat-num">{v}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Events preview ---------- */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <p className="eyebrow mb-1">The lineup</p>
            <h2 className="section-title mb-0">Pick your battle</h2>
          </div>
          <Link to="/events" className="btn btn-link text-navy fw-semibold">All events →</Link>
        </div>
        {error && <div className="alert alert-danger">Could not load events: {error}</div>}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-navy" role="status" /></div>
        ) : (
          <div className="row g-4">
            {events.slice(0, 3).map((ev) => (
              <div className="col-md-6 col-lg-4" key={ev._id}><EventCard ev={ev} /></div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- How it works ---------- */}
      <section className="bg-light-subtle py-5 border-top">
        <div className="container">
          <p className="eyebrow mb-1 text-center">How it works</p>
          <h2 className="section-title text-center mb-5">Three steps to the court</h2>
          <div className="row g-4">
            {[
              ["1", "Create an account", "Sign up with your email and phone number so we can reach your captain."],
              ["2", "Register your team", "Choose a sport, add your players and confirm. Slots update live."],
              ["3", "Show up & play", "Get approved by the organisers and check the fixtures on match day."],
            ].map(([n, t, d]) => (
              <div className="col-md-4" key={n}>
                <div className="step-card h-100 p-4">
                  <div className="step-num">{n}</div>
                  <h3 className="h5 fw-bold mt-3">{t}</h3>
                  <p className="text-muted mb-0">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ (Bootstrap accordion) ---------- */}
      <section className="container py-5" style={{ maxWidth: 820 }}>
        <h2 className="section-title text-center mb-4">FAQs</h2>
        <div className="accordion" id="faq">
          {[
            ["Who can participate?", "Any college student or club player above 16. One person can play in multiple sports if the timings don't clash."],
            ["How do I pay the entry fee?", "The fee is collected at the venue desk on match day before your first game. Approved teams get a confirmation."],
            ["Can I change players after registering?", "Yes, use the feedback/contact form to reach the organisers at least 48 hours before the event."],
            ["What should we bring?", "Your own racquets/paddles and sports shoes. Balls, shuttles and bibs are provided."],
          ].map(([q, a], i) => (
            <div className="accordion-item" key={q}>
              <h3 className="accordion-header">
                <button className={`accordion-button ${i ? "collapsed" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`}>
                  {q}
                </button>
              </h3>
              <div id={`faq${i}`} className={`accordion-collapse collapse ${i ? "" : "show"}`} data-bs-parent="#faq">
                <div className="accordion-body text-muted">{a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
