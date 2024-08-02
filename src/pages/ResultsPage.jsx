// import { useState, useEffect } from "react";
// import { Card, Button, message, Spin } from "antd";
// import { Bar } from "react-chartjs-2";
// import { Chart, registerables } from "chart.js";
// import { jsPDF } from "jspdf";
// import axios from "axios";

// Chart.register(...registerables);

// const ResultsPage = () => {
//  const [chartData, setChartData] = useState(null);
//  const [electionData, setElectionData] = useState(null);
//  const [loading, setLoading] = useState(true);


//  useEffect(() => {
 
//    fetchElectionResults();
//  },[]);

//  const fetchElectionResults = async () => {
//    try {
//      console.log(
//        `Fetching results from: ${
//          import.meta.env.VITE_API_URL
//        }/results/`
//      );
//      const response = await axios.get(
//        `${import.meta.env.VITE_API_URL}/results/`,
//        {
//          headers: {
//            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//          },
//        }
//      );
//      setElectionData(response.data);
//      console.log(response.data)
//      setChartData(processData(response.data.results));
//      setLoading(false);
//    } catch (error) {
//      console.error("Failed to fetch election results:", error);
//      message.error("Failed to load election results.");
//      setLoading(false);
//    }
//  };


//   const processData = (results) => {
//     const labels = [];
//     const data = [];
//     const colors = [];

//     results.forEach((portfolio) => {
//       if (portfolio.candidates.length === 1) {
//         const candidate = portfolio.candidates[0];
//         labels.push(`${portfolio.name} - Yes`, `${portfolio.name} - No`);
//         data.push(candidate.yesNoVotes?.yes || 0);
//         data.push(candidate.yesNoVotes?.no || 0);
//         colors.push("#4CAF50", "#F44336");
//       } else {
//         portfolio.candidates.forEach((candidate) => {
//           labels.push(`${portfolio.name} - ${candidate.name}`);
//           data.push(candidate.votes || 0);
//           colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
//         });
//       }
//     });

//     return {
//       labels,
//       datasets: [
//         {
//           label: "Votes",
//           data: data,
//           backgroundColor: colors,
//           borderColor: colors,
//           borderWidth: 1,
//         },
//       ],
//     };
//   };

//   const exportToPDF = () => {
//     if (!chartData || !electionData) {
//       message.error("No data available to export.");
//       return;
//     }

//     const doc = new jsPDF();
//     doc.text(`Election Results: ${electionData.electionName}`, 10, 10);
//     doc.text(`Total Votes: ${electionData.totalVotes}`, 10, 20);
//     doc.text(`Status: ${electionData.status}`, 10, 30);

//     let yOffset = 40;
//     chartData.labels.forEach((label, index) => {
//       const votes = chartData.datasets[0].data[index];
//       doc.text(`${label}: ${votes} votes`, 10, yOffset);
//       yOffset += 10;
//     });

//     doc.save("election_results.pdf");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <Card className="p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Election Results</h1>
//       {chartData ? (
//         <div>
//           <Bar
//             data={chartData}
//             options={{
//               scales: {
//                 y: {
//                   beginAtZero: true,
//                   ticks: { callback: (value) => value },
//                 },
//               },
//             }}
//           />
//           <div className="mt-4">
//             <p>
//               <strong>Election Name:</strong> {electionData.electionName}
//             </p>
//             <p>
//               <strong>Total Votes:</strong> {electionData.totalVotes}
//             </p>
//             <p>
//               <strong>Status:</strong> {electionData.status}
//             </p>
//             <p>
//               <strong>Start Time:</strong>{" "}
//               {new Date(electionData.startTime).toLocaleString()}
//             </p>
//             <p>
//               <strong>End Time:</strong>{" "}
//               {new Date(electionData.endTime).toLocaleString()}
//             </p>
//           </div>
//           <Button
//             onClick={exportToPDF}
//             type="primary"
//             style={{ marginTop: 16 }}
//           >
//             Export to PDF
//           </Button>
//         </div>
//       ) : (
//         <p>No votes have been recorded yet.</p>
//       )}
//     </Card>
//   );
// };

// export default ResultsPage;
import { useState, useEffect } from "react";
import { Card, Button, message, Spin } from "antd";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { jsPDF } from "jspdf";
import axios from "axios";

Chart.register(...registerables);

const ResultsPage = () => {
  const [chartData, setChartData] = useState(null);
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElectionResults();
  }, []);

  const fetchElectionResults = async () => {
    try {
      console.log(
        `Fetching results from: ${import.meta.env.VITE_API_URL}/results/`
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/results/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      console.log("Received election data:", response.data);
      setElectionData(response.data);
      setChartData(processData(response.data.results));
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch election results:", error);
      message.error("Failed to load election results.");
      setLoading(false);
    }
  };
const processData = (results) => {
  console.log("Processing results:", results);
  const labels = [];
  const data = [];
  const colors = [];

  results.forEach((portfolio) => {
    if (portfolio.candidates.length === 1) {
      const candidate = portfolio.candidates[0];
      if (candidate.yesNoVotes) {
        labels.push(`${portfolio.name} - Yes`, `${portfolio.name} - No`);
        data.push(candidate.yesNoVotes.yes || 0);
        data.push(candidate.yesNoVotes.no || 0);
        colors.push("#4CAF50", "#F44336");
      } else {
        labels.push(`${portfolio.name} - ${candidate.name}`);
        data.push(candidate.votes || 0);
        colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
      }
    } else {
      portfolio.candidates.forEach((candidate) => {
        labels.push(`${portfolio.name} - ${candidate.name}`);
        data.push(candidate.votes || 0);
        colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
      });
    }
  });

  const chartData = {
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

  console.log("Processed chart data:", chartData);
  return chartData;
};
    const exportToPDF = () => {
      if (!chartData || !electionData) {
        message.error("No data available to export.");
        return;
      }

      const doc = new jsPDF();
      doc.text(`Election Results: ${electionData.electionName}`, 10, 10);
      doc.text(`Total Votes: ${electionData.totalVotes}`, 10, 20);
      doc.text(`Status: ${electionData.status}`, 10, 30);

      let yOffset = 40;
      chartData.labels.forEach((label, index) => {
        const votes = chartData.datasets[0].data[index];
        doc.text(`${label}: ${votes} votes`, 10, yOffset);
        yOffset += 10;
      });

      doc.save("election_results.pdf");
    };

  // ... rest of the component code (exportToPDF function, etc.) ...

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Election Results</h1>
      {chartData ? (
        <div>
          <Bar
            data={chartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (value) => Math.round(value) },
                },
              },
            }}
          />
          <div className="mt-4">
            <p>
              <strong>Election Name:</strong> {electionData.electionName}
            </p>
            <p>
              <strong>Total Voters:</strong> {electionData.totalVotes}
            </p>
            <p>
              <strong>Status:</strong> {electionData.status}
            </p>
            <p>
              <strong>Start Time:</strong>{" "}
              {new Date(electionData.startTime).toLocaleString()}
            </p>
            <p>
              <strong>End Time:</strong>{" "}
              {new Date(electionData.endTime).toLocaleString()}
            </p>
          </div>
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

export default ResultsPage;