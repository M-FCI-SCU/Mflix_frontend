import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Pull saved login state from localStorage / AsyncStorage
  }, []);

  const login = () => {
  };

  const logout = () => {
  };

  const authContextValue = {
    login,
    loggedIn,
    logout
  };

  return <AuthContext.Provider value={authContextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
