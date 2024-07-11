import { Card } from "antd";
import { useAppContext } from "../context/AppProvider";

const ViewCandidates = () => {
  const { candidates } = useAppContext();

  const groupedCandidates = candidates.reduce((acc, candidate) => {
    if (!acc[candidate.portfolio]) {
      acc[candidate.portfolio] = [];
    }
    acc[candidate.portfolio].push(candidate);
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
