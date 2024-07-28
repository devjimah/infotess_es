// import { createContext, useContext, useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [candidates, setCandidates] = useState([]);
//   useEffect(() => {
//     const fetchCandidates = async () => {
//       const response = await axios.get("http://localhost:3000/api/candidate", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.data;
//       setCandidates(data);
//     };

//     fetchCandidates();
//   }, [candidates]);

//   const [elections, setElections] = useState([]);
//   useEffect(() => {
//     const fetchElections = async () => {
//       const response = await axios.get("http://localhost:3000/api/election", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.data;
//       setElections(data);
//     };

//     fetchElections();
//   }, [elections]);

//   const [voters, setVoters] = useState([]);
//   useEffect(() => {
//     const fetchVoters = async () => {
//       const response = await axios.get("http://localhost:3000/api/voter", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.data;
//       setVoters(data);
//     };

//     fetchVoters();
//   }, [voters]);

//   const [portfolios, setPortfolios] = useState([]);
//   useEffect(() => {
//     const fetchPortfolios = async () => {
//       const response = await axios.get("http://localhost:3000/api/portfolio", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.data;
//       setPortfolios(data);
//     };

//     fetchPortfolios();
//   }, [portfolios]);

//   const logout = () => {
//     localStorage.removeItem("currentVoter");
//   };

//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     return localStorage.getItem("isLoggedIn") === "true";
//   });

//   useEffect(() => {
//     localStorage.setItem("isLoggedIn", isLoggedIn);
//   }, [isLoggedIn]);

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem("isLoggedIn");
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         isLoggedIn,
//         setIsLoggedIn,
//         handleLogout,
//         logout,
//         candidates,
//         elections,
//         setElections,
//         voters,
//         portfolios,
//         setCandidates,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// AppProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useAppContext = () => {
//   return useContext(AppContext);
// };
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AppContext = createContext();

const API_BASE_URL = "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AppProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [voters, setVoters] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const fetchData = useCallback(async (endpoint, setter, id = null) => {
    try {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const response = await axiosInstance.get(url);
      setter(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      // Handle error (e.g., show error message to user)
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData("/candidate", setCandidates);
      fetchData("/election", setElections);
      fetchData("/voter", setVoters);
      fetchData("/portfolio", setPortfolios);
    }
  }, [isLoggedIn, fetchData]);
  const fetchSpecificPortfolio = useCallback(
    async (portfolioId) => {
      await fetchData("/portfolio", setPortfolios, portfolioId);
    },
    [fetchData]
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("currentVoter");
    // Clear all state
    setCandidates([]);
    setElections([]);
    setVoters([]);
    setPortfolios([]);
  }, []);

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    handleLogout,
    candidates,
    elections,
    voters,
    portfolios,
    setCandidates,
    setElections,
    fetchSpecificPortfolio,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
