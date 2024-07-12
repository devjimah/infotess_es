import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

const UserChoicesChart = ({ candidates }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchVotesAndUpdateChart = () => {
      const storedVotes = candidates.map((candidate) => {
        candidate.votes;
      });
      if (storedVotes) {
        const votes = JSON.parse(storedVotes);
        setChartData(processData(candidates, votes));
      }
    };

    fetchVotesAndUpdateChart();
    const intervalId = setInterval(fetchVotesAndUpdateChart, 5000); // Auto-reload every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [candidates]);

  const processData = (candidates, votes) => {
    const candidateCounts = candidates.reduce((acc, candidate) => {
      acc[candidate.name] = 0;
      return acc;
    }, {});

    const yesNoCounts = votes.reduce((acc, vote) => {
      if (vote.includes(":")) {
        const [portfolio, choice] = vote.split(": ");
        acc[portfolio] = acc[portfolio] || { Yes: 0, No: 0 };
        acc[portfolio][choice]++;
      } else if (candidateCounts[vote] !== undefined) {
        candidateCounts[vote]++;
      }
      return acc;
    }, {});

    const totalVotes = votes.length;
    const labels = [
      ...Object.keys(candidateCounts),
      ...Object.keys(yesNoCounts).flatMap((portfolio) => [
        `${portfolio} - Yes`,
        `${portfolio} - No`,
      ]),
    ];
    const data = [
      ...Object.values(candidateCounts),
      ...Object.values(yesNoCounts).flatMap((counts) => [
        counts.Yes,
        counts.No,
      ]),
    ];

    const colors = labels.map(() => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    });

    return {
      labels,
      datasets: [
        {
          label: `Votes (out of ${totalVotes})`,
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Card className="p-4">
      {chartData ? (
        <div>
          <Bar
            data={chartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (value) => value },
                },
              },
            }}
          />
        </div>
      ) : (
        <p>No votes has been recorded yet.</p>
      )}
    </Card>
  );
};

UserChoicesChart.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ),
};

export default UserChoicesChart;
