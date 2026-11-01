import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-navy text-white-50 py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-2 small">
        <span>© 2027 PlayOn Sports Fest · Mumbai</span>
        <span>
          <Link to="/events" className="link-light me-3">Events</Link>
          <Link to="/feedback" className="link-light">Contact &amp; Feedback</Link>
        </span>
      </div>
    </footer>
  );
}
