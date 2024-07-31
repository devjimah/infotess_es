import { useState, useEffect } from "react";
import { Card, Button, message } from "antd";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { jsPDF } from "jspdf";

// Register Chart.js components
Chart.register(...registerables);

const UserChoicesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    try {
      // Load candidates from localStorage
      const storedCandidates = JSON.parse(
        localStorage.getItem("candidates") || "[]"
      );
      setCandidates(storedCandidates);
    } catch (error) {
      console.error("Failed to load candidates from localStorage:", error);
      message.error("Failed to load election results.");
    }
  }, []);

  useEffect(() => {
    if (candidates.length > 0) {
      setChartData(processData(candidates));
    }
  }, [candidates]);

  const processData = (candidates) => {
    const portfolios = {};
    candidates.forEach((candidate) => {
      if (!portfolios[candidate.portfolio]) {
        portfolios[candidate.portfolio] = [];
      }
      portfolios[candidate.portfolio].push(candidate);
    });

    const labels = [];
    const data = [];
    const colors = [];

    Object.entries(portfolios).forEach(([portfolio, portfolioCandidates]) => {
      if (portfolioCandidates.length === 1) {
        const candidate = portfolioCandidates[0];
        labels.push(`${portfolio} - Yes`, `${portfolio} - No`);
        data.push(candidate.votes?.filter((v) => v === "Yes").length || 0);
        data.push(candidate.votes?.filter((v) => v === "No").length || 0);
        colors.push("#4CAF50", "#F44336");
      } else {
        portfolioCandidates.forEach((candidate) => {
          labels.push(`${portfolio} - ${candidate.name}`);
          data.push(candidate.votes?.length || 0);
          colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
        });
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Votes",
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    };
  };

  const exportToPDF = () => {
    if (!chartData) {
      message.error("No data available to export.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Election Results", 10, 10);

    let yOffset = 20;
    chartData.labels.forEach((label, index) => {
      const votes = chartData.datasets[0].data[index];
      doc.text(`${label}: ${votes} votes`, 10, yOffset);
      yOffset += 10;
    });

    doc.save("election_results.pdf");
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
          <Button
            onClick={exportToPDF}
            type="primary"
            style={{ marginTop: 16 }}
          >
            Export to PDF
          </Button>
        </div>
      ) : (
        <p>No votes have been recorded yet.</p>
      )}
    </Card>
  );
};

export default UserChoicesChart;
