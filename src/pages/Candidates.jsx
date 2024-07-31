import { useState, useEffect } from "react";
import { Button, Card, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import axios from "axios";
import UserChoicesChart from "./ResultsPage";

const VOTE_YES = "Yes";
const VOTE_NO = "No";

const CandidatesPage = () => {
  const { candidates, setCandidates, portfolios, setPortfolios, user } =
    useAppContext();
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesResponse, portfoliosResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/candidates`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/portfolios`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }),
        ]);
        setCandidates(candidatesResponse.data);
        setPortfolios(portfoliosResponse.data);

        console.log("Fetched portfolios:", portfoliosResponse.data); // Add this line
      } catch (error) {
        message.error("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setCandidates, setPortfolios]);

  const handleVote = (portfolioId, candidateId, voteValue) => {
    console.log(portfolioId);
    console.log(candidateId);
    console.log(voteValue);
    setVotes((prevVotes) => ({
      ...prevVotes,
      [portfolioId]: { candidateId, voteValue },
    }));
  };
  console.log(votes);

  const handleConfirmVotes = async () => {
    try {
      const token = localStorage.getItem("voterToken");
      if (!token) {
        throw new Error("No token found");
      }

      console.log("Votes to be submitted:", votes); // Add this line

      const votePromises = Object.entries(votes).map(
        ([portfolioId, voteInfo]) => {
          if (!portfolioId || !voteInfo.candidateId) {
            throw new Error(`Invalid vote data for portfolio: ${portfolioId}`);
          }

          console.log(`Submitting vote for portfolio: ${portfolioId}`); // Add this line

          return axios.post(
            `${import.meta.env.VITE_API_URL}/vote/${portfolioId}`,
            {
              votes: [
                { candidateId: voteInfo.candidateId, vote: voteInfo.voteValue },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      );

      await Promise.all(votePromises);

      message.success("Votes submitted successfully");
      setVoted(true);
      setTimeout(() => {
        localStorage.removeItem("voterToken");
        navigate("/voters-login");
      }, 2000);
    } catch (error) {
      console.error("Full error object:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error submitting votes";
      message.error(errorMessage);
      console.error("Error submitting votes:", errorMessage);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("voterToken");
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

        // Skip rendering "Women Commissioner" portfolio for male voters
        if (
          user?.GENDER.toLowerCase() === "male" &&
          portfolio?.name.toLowerCase() === "women commissioner"
        ) {
          return null;
        }

        return (
          <div key={portfolioId} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {portfolio?.name.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {candidates.map((candidate) => (
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
                >
                  <Card.Meta title={candidate.name.toUpperCase()} />
                  {candidates.length > 1 ? (
                    <Button
                      onClick={() =>
                        handleVote(portfolioId, candidate._id, "Vote")
                      }
                      disabled={
                        votes[portfolioId]?.candidateId === candidate._id
                      }
                    >
                      Vote
                    </Button>
                  ) : (
                    <div>
                      <Button
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          marginRight: "8px",
                        }}
                        onClick={() =>
                          handleVote(portfolioId, candidate._id, VOTE_YES)
                        }
                        disabled={
                          votes[portfolioId]?.candidateId === candidate._id
                        }
                      >
                        {VOTE_YES}
                      </Button>
                      <Button
                        style={{ backgroundColor: "red", color: "white" }}
                        onClick={() =>
                          handleVote(portfolioId, candidate._id, VOTE_NO)
                        }
                        disabled={
                          votes[portfolioId]?.candidateId === candidate._id
                        }
                      >
                        {VOTE_NO}
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      ;
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
