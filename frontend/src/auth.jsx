import axios from "axios";
import { createContext, useContext, useState } from "react";
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  let decodedToken = null;
  try {
    decodedToken = jwtDecode(localStorage.getItem('buy-sell-auth-token'));
  } catch {
    decodedToken = null;
  }
  const [user, setUser] = useState(decodedToken);

  const login = (Token) => {
    setUser(jwtDecode(Token));
    axios.defaults.headers.common["Authorization"] = "Bearer " + Token;
    localStorage.setItem('buy-sell-auth-token', Token);
  };

  const logout = () => {
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>
  );
};

const Protected = ({ children }) => {
  const ctx = useContext(AuthContext);
  if(!ctx.user) return <Navigate to="/?mode=login" />;
  return <>{children}</>;
};

export { AuthProvider, AuthContext };
export default Protected;