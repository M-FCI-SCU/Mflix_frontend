import React, { createContext, useState, useEffect } from "react";
import {
  useQuery,
  gql
} from "@apollo/client";


const CHECKUSEREXIST = gql`
  query checkUserExistQuery{
    checkUserExist{
      _id
      name
      email
    }
  }
`
const AuthContext = createContext({});


const AuthProvider = (props) => {
  const [isAuth, setAuh] = useState(false);
  const [user, setUser] = useState(null);
  const { data, loading } = useQuery(CHECKUSEREXIST)


  useEffect(() => {
    // Pull saved login state from localStorage / AsyncStorage
    if (data) {
      if (localStorage.getItem('isAuth')) {
        setAuh(true)
      } else {
        setAuh(false)
      }
      setUser({ ...data.checkUserExist })
    }
  }, [data]);

  const setLogin = (data) => {
    if (data && data.login) {
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('isAuth', true);
      setAuh(true)
      setUser({ id: data.login._id, email: data.login.email, name: data.login.name });
    }
  };

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAuth');
    setAuh(false)
    setUser(null)
  };

  const authContextValue = {
    authLoading: loading,
    setLogin,
    isAuth,
    logout,
    user
  };

  return <AuthContext.Provider value={authContextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
