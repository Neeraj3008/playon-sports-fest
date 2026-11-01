import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useToast } from "./Toast.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    toast("Logged out", "secondary");
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-navy sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand brand" to="/">
          <span className="brand-ball" /> PlayOn<span className="text-lime">Fest</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/events">Events</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/register">Register Team</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/feedback">Feedback</NavLink></li>
            {user?.role === "admin" && (
              <li className="nav-item"><NavLink className="nav-link" to="/admin">Dashboard</NavLink></li>
            )}
            {user ? (
              <li className="nav-item dropdown">
                <button className="btn btn-lime btn-sm dropdown-toggle ms-lg-2" data-bs-toggle="dropdown" aria-expanded="false">
                  Hi, {user.name.split(" ")[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/my-teams">My Teams</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Log out</button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-lime btn-sm ms-lg-2" to="/login">Login / Sign up</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
