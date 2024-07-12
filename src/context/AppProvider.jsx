import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AppContext = createContext();

export const AppProvider = ({ children }) => {


   const [voterRegister, setVoterRegister] = useState([]);

   useEffect(() => {
     const savedVoterRegister =
       JSON.parse(localStorage.getItem("voterRegister")) || [];
    // Add this line
     setVoterRegister(savedVoterRegister);
   }, []);

  useEffect(() => {
    localStorage.setItem("voterRegister", JSON.stringify(voterRegister));
  }, [voterRegister]);

    const [usedOtps, setUsedOtps] = useState([]);

  useEffect(() => {
    const savedVoterRegister =
      JSON.parse(localStorage.getItem("voterRegister")) || [];
    setVoterRegister(savedVoterRegister);
    const savedCandidates =
      JSON.parse(localStorage.getItem("candidates")) || [];
    setCandidates(savedCandidates);
  }, []);

  useEffect(() => {
    const savedVoterRegister =
      JSON.parse(localStorage.getItem("voterRegister")) || [];
    setVoterRegister(savedVoterRegister);
  }, []);

  const logout = () => {
    localStorage.removeItem("currentVoter");
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [elections, setElections] = useState(() => {
    const savedElections = localStorage.getItem("elections");
    return savedElections ? JSON.parse(savedElections) : [];
  });

  const [candidates, setCandidates] = useState(() => {
    const storedCandidates = localStorage.getItem("candidates");
    return storedCandidates ? JSON.parse(storedCandidates) : [];
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("elections", JSON.stringify(elections));
  }, [elections]);

  useEffect(() => {
    localStorage.setItem("candidates", JSON.stringify(candidates));
  }, [candidates]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        elections,
        setElections,
        candidates,
        setCandidates,
        handleLogout,
        voterRegister,
        setVoterRegister,
        logout,
        usedOtps,
        setUsedOtps,
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
