import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    console.log(`Token as obtained from local storage: ${token}`);
    if(token) {
      setUser(token);
    }
  }, []);

  const login = (userData) => {
    // setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("token", JSON.stringify(userData));
  };

  const logout = () => {
    // setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
