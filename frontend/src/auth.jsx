import axios from "axios";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(() => ({
      token,
      setToken,
    }), [token]);

  const login = (Token) => {
    setToken(Token);
    axios.defaults.headers.common["Authorization"] = "Bearer " + Token;
    localStorage.setItem('token', Token);
  };

  const logout = () => {
    // console.log("LOGGING OUT");
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem('token');
  }

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={{contextValue, login, logout}}>{children}</AuthContext.Provider>
  );
};

const Protected = ({ children }) => {
  const ctx = useContext(AuthContext);
  // const [decodedToken  , setDecodedToken] = useState(null);
  // console.dir(ctx);

  // TO DO: GET RID OF THIS WARNING IN THE BELOW CODE, SETTING STATE WHILE NOT INSIDE USEEFFECT
  let decodedToken;
  try {
    // console.dir(ctx.contextValue);
    decodedToken = jwtDecode(ctx.contextValue.token);
  }
  catch {
    // console.error(error);
    ctx.logout();
  }
  // console.dir(decodedToken);

  // useEffect(() => {
  //   try {
  //       // console.dir(ctx.contextValue);
  //       const decodedToken = jwtDecode(ctx.contextValue.token);
  //       setDecodedToken(decodedToken);
  //     }
  //     catch {
  //       // console.error(error);
  //       ctx.logout();
  //     }
  // }, [ctx, ctx.contextValue.token]);

  const childrenWithProps = React.Children.map(children, child => {
    return React.cloneElement(child, { ctx, decodedToken });
  });

  if(!decodedToken) return <Navigate to="/?mode=login" />;

  // If authenticated, render the child routes
  return <>{childrenWithProps}</>;
};

export { AuthProvider , AuthContext };
export default Protected;