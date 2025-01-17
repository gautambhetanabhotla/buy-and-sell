import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // const token = JSON.parse(localStorage.getItem("token"));
    const Token = localStorage.getItem("token");
    console.log(`Token as obtained from local storage: ${Token}`);
    if(Token) {
      try {
        jwtDecode(Token); // Ensure the token is valid
        setToken(Token);
      } catch (error) {
        console.error('Invalid token ne abba:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (Token) => {
    // setIsAuthenticated(true);
    setToken(Token);
    // localStorage.setItem("token", JSON.stringify(userData));
    localStorage.setItem("token", Token);
  };

  const logout = () => {
    // setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
