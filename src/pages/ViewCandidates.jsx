import { Card, message } from "antd";
import { useAppContext } from "../context/AppProvider";
import axios from "axios";
import { useEffect, useState } from "react";

const ViewCandidates = () => {
  const { candidates } = useAppContext();
  const [portfolioNames, setPortfolioNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPortfolios = async () => {
      const portfolioIds = [
        ...new Set(candidates.map((candidate) => candidate.portfolioId)),
      ];

      const portfolioNamesMap = {};

      try {
        const requests = portfolioIds.map((id) =>
          axios.get(`http://localhost:3000/api/portfolio/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          })
        );

        const responses = await Promise.all(requests);

        responses.forEach((response, index) => {
          portfolioNamesMap[portfolioIds[index]] = response?.data?.name;
        });
        console.log(portfolioNamesMap);
        setPortfolioNames(portfolioNamesMap);
        setLoading(false);
      } catch (error) {
        message.error("Error fetching portfolio names");
        console.error("Error fetching portfolio names:", error);
      }
    };

    fetchAllPortfolios();
  }, [candidates]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const groupedCandidates = candidates.reduce((acc, candidate) => {
    const portfolioName = portfolioNames[candidate.portfolio];
    if (!acc[portfolioName]) {
      acc[portfolioName] = [];
    }
    acc[portfolioName].push(candidate);
    return acc;
  }, {});

  const sortedPortfolios = Object.keys(groupedCandidates).sort(
    (a, b) => groupedCandidates[b].length - groupedCandidates[a].length
  );

  return (
    <div className="p-4 bg-blue-50 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center uppercase">
          Candidates
        </h1>
        {sortedPortfolios.map((portfolio) => (
          <div key={portfolio} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {portfolio.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedCandidates[portfolio].map((candidate) => (
                <Card
                  key={candidate.name}
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    width: 200,
                    height: 220,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  hoverable
                  cover={
                    <img
                      alt={candidate.name}
                      src={candidate.image}
                      style={{ height: 130, objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={candidate.name.toUpperCase()}
                    description={candidate.portfolio.toUpperCase()}
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCandidates;
