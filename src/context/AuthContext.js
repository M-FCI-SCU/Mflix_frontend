import React, { createContext, useState, useEffect } from "react";
import {
  useQuery,
  gql
} from "@apollo/client";


const CHECKUSEREXIST = gql`
  query checkUserExistQuery{
    checkUserExist{
      email
    }
  }
`
const AuthContext = createContext({});


const AuthProvider = (props) => {
  let isAuth = localStorage.getItem('isAuth') ? true : false
  const [loggedIn, setLoggedIn] = useState(isAuth);
  const [user, setUser] = useState(null);
  const {data} = useQuery(CHECKUSEREXIST)


  useEffect(() => {
    // Pull saved login state from localStorage / AsyncStorage
    if (data) {
      setLoggedIn(true)
      setUser({...data.checkUserExist})
    }
  }, [data]);

  const setLogin = (data) => {
    if (data && data.login) {
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('email', data.login.email);
      localStorage.setItem('isAuth', true);
      setLoggedIn(true)
    }
  };

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('isAuth');
    setLoggedIn(false)
  };

  const authContextValue = {
    setLogin,
    loggedIn,
    logout,
    user
  };

  return <AuthContext.Provider value={authContextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
