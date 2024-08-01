import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PastElections() {
  const navigate = useNavigate();
  const [fetchElections, setElections] = useState([]);

  async function fetchPastElections() {
    const API_BASE_URL = "http://localhost:3000/api"; // Fix the environment variable access

    try {
      const response = await axios.get(`${API_BASE_URL}/election`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      return setElections(response.data);
    } catch (error) {
      return message.error("An error occurred. Please try again.");
    }
  }

  useEffect(() => {
    fetchPastElections();
  }, []);

  return (
    <>
      <h1 className="text-lg font-bold mt-4">Past Elections</h1>
      <div className="max-w-3xl p-6 mx-auto overflow-x-auto">
        {fetchElections.length ? (
          fetchElections
            .filter((e) => e.status === "ended")
            .map((election) => (
              <div
                key={election.title}
                className="border p-2 rounded-md flex justify-between items-center mb-4"
                style={{ width: "650px" }}
              >
                <div className="flex items-center space-x-2">
                  <h4 className="text-md font-medium">{election.title}</h4>
                  <Button
                    type="default"
                    className="border border-dashed rounded-md h-[20px] ml-2 border-gray-500 text-gray-500"
                  >
                    Ended
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="default"
                    className="border text-[12px] font-bold h-[30px] border-dashed"
                    onClick={() => {
                      console.log("Show details for election:", election.title);
                    }}
                  >
                    Election Details
                  </Button>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center">No past elections.</p>
        )}
      </div>
      <div className="max-w-3xl p-6 mx-auto flex justify-center">
        <Button type="primary" onClick={() => navigate("/dashboard/elections")}>
          Back to Create Election
        </Button>
      </div>
    </>
  );
}

export default PastElections;
