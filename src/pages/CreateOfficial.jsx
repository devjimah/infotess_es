
import { useState, useEffect } from "react";
import { Button, List, message } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";

function CreateOfficial() {
  const [officials, setOfficials] = useState([]);
  const [currentElectionEnds] = useState(() =>
    moment().add(30, "days").toDate()
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchOfficials();
  }, []);

  useEffect(() => {
    const checkElectionEnd = () => {
      if (
        currentElectionEnds &&
        moment().isAfter(moment(currentElectionEnds))
      ) {
        revokeAllAccess();
      }
    };

    checkElectionEnd();
  }, [currentElectionEnds]);

  const fetchOfficials = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/official`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setOfficials(response.data);
    } catch (error) {
      console.error("Error fetching officials:", error);
      message.error("Failed to fetch officials");
    }
  };

  const handleGrantAccess = async (studentId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/official/access/${studentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      message.success("Access granted successfully.");
      fetchOfficials(); // Refresh the list
    } catch (error) {
      console.error("Error granting access:", error);
      message.error("Failed to grant access");
    }
  };

  const handleRevokeAccess = async (studentId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/official/revoke/${studentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      message.success("Access revoked successfully.");
      fetchOfficials(); // Refresh the list
    } catch (error) {
      console.error("Error revoking access:", error);
      message.error("Failed to revoke access");
    }
  };

  const revokeAllAccess = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/official/revoke-all-access`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      message.warning(
        "Access revoked for all officials as the current election has ended."
      );
      fetchOfficials(); // Refresh the list
    } catch (error) {
      console.error("Error revoking all access:", error);
      message.error("Failed to revoke all access");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-lg font-bold mb-4">Officials</h3>
      <List
        itemLayout="horizontal"
        dataSource={officials}
        renderItem={(official) => (
          <List.Item key={official._id}>
            <div className="flex justify-between items-center w-full mb-4">
              <div className="flex items-center space-x-3">
                <h4 className="text-md font-medium">{official.fullName}</h4>
                <Button
                  type="default"
                  className={`border border-dashed rounded-md h-[20px] ${
                    official.access
                      ? "border-green-500 text-[10px] font-bold text-green-500"
                      : "border-red-500 text-[10px] font-bold text-red-500"
                  }`}
                >
                  {official.access ? " Granted" : "Access Denied"}
                </Button>
              </div>
              <Button
                type="default"
                onClick={
                  official.access
                    ? () => handleRevokeAccess(official.STUDENTID)
                    : () => handleGrantAccess(official.STUDENTID)
                }
                className="border text-[12px] font-bold h-[30px] border-dashed"
              >
                {official.access ? "Revoke Access" : "Grant Access"}
              </Button>
            </div>
          </List.Item>
        )}
      />
      <div className="flex justify-center mt-4">
        <Button type="primary" onClick={() => navigate("/otp-screen")}>
          Go to Login
        </Button>
      </div>
    </div>
  );
}

export default CreateOfficial;