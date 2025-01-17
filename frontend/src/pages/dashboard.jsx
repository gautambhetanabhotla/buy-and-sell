import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../auth.jsx";

const DashboardPage = () => {
  const { token, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!token) {
        navigate('/');
      } else {
        try {
          const decoded = jwtDecode(token);
          setDecodedToken(decoded);
          console.log(decoded);
        } catch (error) {
          console.error('Invalid token:', error);
          navigate('/');
        }
      }
    }
  }, [token, loading, navigate]);

  return (
    <>
      <h1>Dashboard Page</h1>
      <h2>You are logged in as: {decodedToken.email}</h2>
    </>
  );
};

export default DashboardPage;
