import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../auth.jsx";

const DashboardPage = () => {
  const { decodedToken, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !decodedToken) {
      navigate('/');
    }
  }, [decodedToken, loading, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Dashboard Page</h1>
      <h2>You are logged in as: {decodedToken.email}</h2>
    </>
  );
};

export default DashboardPage;
