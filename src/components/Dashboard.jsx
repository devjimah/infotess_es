import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CreateElection from "../pages/CreateElection";
import CreateOfficial from "../pages/CreateOfficial";
import Settings from "./Settings";
import Main from "../pages/Main";
import PastElections from "../pages/PastElections";
import { useAppContext } from "../context/AppProvider";

function Dashboard() {
  const { elections, setElections } = useAppContext();

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-8 p-5">
        <Routes>
          <Route path="main-page" element={<Main />} />
          <Route
            path="elections"
            element={
              <CreateElection
                elections={elections}
                setElections={setElections}
              />
            }
          />
          <Route path="create-official" element={<CreateOfficial />} />
          <Route
            path="past-elections"
            element={<PastElections elections={elections} />}
          />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="main-page" />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
