import { useState, useEffect } from "react";
import { Button, Card, message, Radio, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import axios from "axios";
import UserChoicesChart from "./ResultsPage";

const CandidatesPage = () => {
  const { candidates, setCandidates, portfolios } = useAppContext();
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/candidate",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCandidates(response.data);
      } catch (error) {
        message.error("Error fetching candidates");
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, [setCandidates]);

  const handleVoteChange = (portfolioId, candidateId, voteValue) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [portfolioId]: { candidateId, voteValue },
    }));
  };

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

 const handleConfirmVotes = async () => {
   try {
     for (const [portfolioId, voteInfo] of Object.entries(votes)) {
       const { candidateId, voteValue } = voteInfo;
       console.log(
         `Sending vote for candidate: ${candidateId}, vote: ${voteValue}`
       );
       const response = await axiosInstance.post(`/vote/${candidateId}`, {
         vote: voteValue,
       });
       console.log(`Vote response for ${candidateId}:`, response.data);
     }
     message.success("Votes submitted successfully");
     setVoted(true);
     setTimeout(() => {
       localStorage.removeItem("token");
       navigate("/voters-login");
     }, 2000);
   } catch (error) {
     console.error("Full error object:", error);
     const errorMessage =
       error.response?.data || error.message || "Error submitting votes";
     message.error(errorMessage);
     console.error("Error submitting votes:", errorMessage);

     if (error.response?.status === 401 || error.response?.status === 403) {
       localStorage.removeItem("token");
       navigate("/voters-login");
     }
   }
 };

  const groupedCandidates = candidates.reduce((acc, candidate) => {
    const portfolioId = candidate.portfolio;
    if (!acc[portfolioId]) {
      acc[portfolioId] = [];
    }
    acc[portfolioId].push(candidate);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center uppercase">
        Cast Your Votes
      </h1>
      {Object.entries(groupedCandidates).map(([portfolioId, candidates]) => {
        const portfolio = portfolios.find((p) => p._id === portfolioId);
        return (
          <div key={portfolioId} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {portfolio?.name.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {candidates.length === 1 ? (
                <Card
                  key={candidates[0]._id}
                  hoverable
                  cover={
                    <img
                      alt={candidates[0].name}
                      src={candidates[0].image}
                      style={{ height: 130, objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta title={candidates[0].name.toUpperCase()} />
                  <Radio.Group
                    onChange={(e) =>
                      handleVoteChange(
                        portfolioId,
                        candidates[0]._id,
                        e.target.value
                      )
                    }
                    value={votes[portfolioId]?.voteValue}
                  >
                    <Radio.Button value="Yes">Yes</Radio.Button>
                    <Radio.Button value="No">No</Radio.Button>
                  </Radio.Group>
                </Card>
              ) : (
                candidates.map((candidate) => (
                  <Card
                    key={candidate._id}
                    hoverable
                    cover={
                      <img
                        alt={candidate.name}
                        src={candidate.image}
                        style={{ height: 130, objectFit: "cover" }}
                      />
                    }
                    onClick={() =>
                      handleVoteChange(portfolioId, candidate._id, "Vote")
                    }
                    className={`${
                      votes[portfolioId]?.candidateId === candidate._id
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                  >
                    <Card.Meta title={candidate.name.toUpperCase()} />
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
      <div className="text-center mt-8">
        <Button
          type="primary"
          onClick={handleConfirmVotes}
          disabled={
            Object.keys(votes).length !== Object.keys(groupedCandidates).length
          }
        >
          Confirm Votes
        </Button>
      </div>
      {voted && (
        <Modal visible={true} footer={null} closable={false}>
          <UserChoicesChart candidates={candidates} />
        </Modal>
      )}
    </div>
  );
};

export default CandidatesPage;
