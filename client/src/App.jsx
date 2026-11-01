import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import RegisterTeam from "./pages/RegisterTeam.jsx";
import Feedback from "./pages/Feedback.jsx";
import MyTeams from "./pages/MyTeams.jsx";
import Admin from "./pages/Admin.jsx";
import { useAuth } from "./AuthContext.jsx";

function Protected({ children, admin = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace state={{ needLogin: true }} />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<Protected><RegisterTeam /></Protected>} />
          <Route path="/my-teams" element={<Protected><MyTeams /></Protected>} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
