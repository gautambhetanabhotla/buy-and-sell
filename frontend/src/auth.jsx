import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    // console.log('Stored Token:', storedToken);
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (Token) => {
    try {
      const decoded = jwtDecode(Token);
      setToken(Token);
      setDecodedToken(decoded);
      localStorage.setItem("token", Token);
    } catch (error) {
      console.error('Invalid token:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setDecodedToken(null);
    localStorage.removeItem("token");
    // navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, decodedToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
