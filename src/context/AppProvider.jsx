import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  useEffect(() => {
    const fetchCandidates = async () => {
      const response = await axios.get("http://localhost:3000/api/candidate", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.data;
      setCandidates(data);
    };

    fetchCandidates();
  }, [candidates]);

  const [elections, setElections] = useState([]);
  useEffect(() => {
    const fetchElections = async () => {
      const response = await axios.get("http://localhost:3000/api/election", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.data;
      setElections(data);
    };

    fetchElections();
  }, [elections]);

  const [voters, setVoters] = useState([]);
  useEffect(() => {
    const fetchVoters = async () => {
      const response = await axios.get("http://localhost:3000/api/voter", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.data;
      setVoters(data);
    };

    fetchVoters();
  }, [voters]);

  const [portfolios, setPortfolios] = useState([]);
  useEffect(() => {
    const fetchPortfolios = async () => {
      const response = await axios.get("http://localhost:3000/api/portfolio", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.data;
      setPortfolios(data);
    };

    fetchPortfolios();
  }, [portfolios]);

  const logout = () => {
    localStorage.removeItem("currentVoter");
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        handleLogout,
        logout,
        candidates,
        elections,
        setElections,
        voters,
        portfolios,
        setCandidates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAppContext = () => {
  return useContext(AppContext);
};
