// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";

// const AppContext = createContext();

// const API_BASE_URL = "http://localhost:3000/api";

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const AppProvider = ({ children }) => {
//   const [candidates, setCandidates] = useState([]);
//   const [elections, setElections] = useState([]);
//   const [voters, setVoters] = useState([]);
//   const [portfolios, setPortfolios] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     () => localStorage.getItem("isLoggedIn") === "true"
//   );

//   const fetchData = useCallback(async (endpoint, setter, id = null) => {
//     try {
//       const url = id ? `${endpoint}/${id}` : endpoint;
//       const response = await axiosInstance.get(url);
//       setter(response.data);
//     } catch (error) {
//       console.error(`Error fetching ${endpoint}:`, error);
//       // Handle error (e.g., show error message to user)
//     }
//   }, []);

//   useEffect(() => {
//     if (isLoggedIn) {
//       fetchData("/candidate", setCandidates);
//       fetchData("/election", setElections);
//       fetchData("/voter", setVoters);
//       fetchData("/portfolio", setPortfolios);
//     }
//   }, [isLoggedIn, fetchData]);

//   const fetchSpecificPortfolio = useCallback(
//     async (portfolioId) => {
//       try {
//         const response = await axiosInstance.get(`/portfolio/${portfolioId}`);
//         setPortfolios((prevPortfolios) => [...prevPortfolios, response.data]);
//       } catch (error) {
//         console.error(`Error fetching portfolio ${portfolioId}:`, error);
//       }
//     },
//     [fetchData]
//   );

//   useEffect(() => {
//     localStorage.setItem("isLoggedIn", isLoggedIn);
//   }, [isLoggedIn]);

//   const handleLogout = useCallback(() => {
//     setIsLoggedIn(false);
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("token");
//     localStorage.removeItem("currentVoter");
//     // Clear all state
//     setCandidates([]);
//     setElections([]);
//     setVoters([]);
//     setPortfolios([]);
//   }, []);

//   const contextValue = {
//     isLoggedIn,
//     setIsLoggedIn,
//     handleLogout,
//     candidates,
//     elections,
//     voters,
//     portfolios,
//     setCandidates,
//     setElections,
//     setPortfolios,
//     fetchSpecificPortfolio,
//   };

//   return (
//     <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
//   );
// };

// AppProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useAppContext must be used within an AppProvider");
//   }
//   return context;
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
  const token = localStorage.getItem("adminToken");
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
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser !== null ? JSON.parse(storedUser) : null;
  });

  const fetchData = useCallback(async (endpoint, setter, id = null) => {
    try {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const response = await axiosInstance.get(url);
      setter(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData("/candidates", setCandidates);
      fetchData("/election", setElections);
      fetchData("/voter", setVoters);
      fetchData("/portfolios", setPortfolios);
    }
  }, [isLoggedIn, fetchData]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    if (isLoggedIn) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [isLoggedIn]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("official");
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
    setPortfolios,
    user,
    setUser,
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
