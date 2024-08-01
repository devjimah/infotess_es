
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import OTPGenerator from "./pages/OTPScreen";
import Candidates from "./pages/Candidates";
import UserChoicesChart from "./pages/ResultsPage";
import ViewCandidates from "./pages/ViewCandidates";
import { useAppContext } from "./context/AppProvider";
import VotersLogin from "./pages/VotersLogin";

function App() {
  const { isLoggedIn, candidates } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/voters-login" element={<VotersLogin />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/otp-screen" element={<OTPGenerator />} />
      <Route path="/candidates" element={<Candidates />} />
      <Route path="/view-candidates" element={<ViewCandidates />} />
      <Route
        path="/chart"
        element={<UserChoicesChart candidates={candidates} />}
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
