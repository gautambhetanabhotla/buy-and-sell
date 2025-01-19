import axios from "axios";
import React, { createContext, useContext, useLayoutEffect, useMemo, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token',token);
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
    console.log("LOGGING OUT");
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
  console.dir(ctx);
  const navigate = useNavigate();
  let decodedToken;
  try {
    console.dir(ctx.contextValue);
    decodedToken = jwtDecode(ctx.contextValue.token);
  }
  catch (error) {
    console.error(error);
    ctx.logout();
  }
  console.dir(decodedToken);

  const childrenWithProps = React.Children.map(children, child => {
    return React.cloneElement(child, { ctx, decodedToken });
  });

  // Check if the user is authenticated
  useLayoutEffect(() => {
    if (!decodedToken) {
      navigate("/?mode=login");
    }
  }, [ctx, decodedToken, navigate]);

  // If authenticated, render the child routes
  return <>{childrenWithProps}</>;
};

export { AuthProvider , AuthContext };
export default Protected;