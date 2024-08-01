import { useState, useEffect } from "react";
import { Button, Card, message, Row, Col, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import axios from "axios";

const VOTE_YES = "Yes";
const VOTE_NO = "No";

const CandidatesPage = () => {
  const { candidates, setCandidates, portfolios, setPortfolios, user } =
    useAppContext();
  const [votes, setVotes] = useState({});
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
      } catch (error) {
        message.error("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setCandidates, setPortfolios]);

  const handleVote = (portfolioId, candidateId, voteValue) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [portfolioId]: { candidateId, voteValue },
    }));
    setCurrentPortfolioIndex((prevIndex) => prevIndex + 1);
  };

  const handleConfirmVotes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("voterToken");
      if (!token) throw new Error("No token found");

      const votePromises = Object.entries(votes).map(
        ([portfolioId, voteInfo]) => {
          if (!portfolioId || !voteInfo.candidateId) {
            throw new Error(`Invalid vote data for portfolio: ${portfolioId}`);
          }
          return axios.post(
            `${import.meta.env.VITE_API_URL}/vote/${portfolioId}`,
            {
              votes: [
                { candidateId: voteInfo.candidateId, vote: voteInfo.voteValue },
              ],
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      );

      await Promise.all(votePromises);

      message.success("Votes submitted successfully");
      setTimeout(() => {
        localStorage.removeItem("voterToken");
        navigate("/voters-login");
      }, 2000);
    } catch (error) {
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
    } finally {
      setIsLoading(false);
    }
  };

  const eligiblePortfolios = portfolios.filter(
    (portfolio) =>
      !(
        user?.GENDER.toLowerCase() === "male" &&
        portfolio.name.toLowerCase() === "women commissioner"
      )
  );

  const currentPortfolio = eligiblePortfolios[currentPortfolioIndex];
  const currentCandidates = candidates.filter(
    (c) => c.portfolioId === currentPortfolio?._id
  );
  const allVotesCast = currentPortfolioIndex >= eligiblePortfolios.length;

  const renderVoteSummary = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Your Votes Summary
        </h2>
        <Row gutter={[16, 16]}>
          {Object.entries(votes).map(([portfolioId, vote]) => {
            const portfolio = portfolios.find((p) => p._id === portfolioId);
            const candidate = candidates.find(
              (c) => c._id === vote.candidateId
            );
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={portfolioId}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={candidate?.name}
                      src={candidate?.image}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={portfolio?.name}
                    description={
                      <div>
                        <p>
                          <strong>Candidate:</strong> {candidate?.name}
                        </p>
                        <p>
                          <strong>Vote:</strong> {vote.voteValue}
                        </p>
                      </div>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center uppercase">
        Cast Your Votes
      </h1>
      {!allVotesCast ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {currentPortfolio.name.toUpperCase()}
          </h2>
          <div
            className={`grid ${
              currentCandidates.length === 1
                ? "justify-center"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            } gap-6`}
          >
            {currentCandidates.map((candidate) => (
              <Card
                key={candidate._id}
                hoverable
                className={
                  currentCandidates.length === 1
                    ? "h-[400px] w-[300px]"
                    : "h-[320px]"
                }
                cover={
                  <img
                    alt={candidate.name}
                    src={candidate.image}
                    style={{
                      height: currentCandidates.length === 1 ? 280 : 220,
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Card.Meta
                  className="mt-3 flex items-center flex-col"
                  title={candidate.name.toUpperCase()}
                />
                {currentCandidates.length > 1 ? (
                  <div className="flex items-center justify-center">
                    <Button
                      className="mt-4 w-[150px]"
                      type="primary"
                      onClick={() =>
                        handleVote(currentPortfolio._id, candidate._id, "Vote")
                      }
                    >
                      Vote
                    </Button>
                  </div>
                ) : (
                  <div className="w-full mt-3 flex items-center justify-evenly">
                    <Button
                      type="primary"
                      onClick={() =>
                        handleVote(
                          currentPortfolio._id,
                          candidate._id,
                          VOTE_YES
                        )
                      }
                    >
                      {VOTE_YES}
                    </Button>
                    <Button
                      type="default"
                      style={{ backgroundColor: "red" }}
                      onClick={() =>
                        handleVote(currentPortfolio._id, candidate._id, VOTE_NO)
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
      ) : (
        <div className="mt-8">
          {renderVoteSummary()}
          <div className="text-center mt-8">
            <Spin spinning={isLoading}>
              <Button
                type="primary"
                onClick={handleConfirmVotes}
                size="large"
                disabled={isLoading}
              >
                {isLoading ? "Submitting Votes..." : "Confirm Votes"}
              </Button>
            </Spin>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;
