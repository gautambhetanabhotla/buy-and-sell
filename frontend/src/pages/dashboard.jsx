import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../auth.jsx";

const DashboardPage = () => {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!ctx.user) {
      navigate('/');
    }
  }, [ctx.user, navigate]);

  if(!ctx.user) {
    return <p>Loading...</p>;
  }
  // const user = jwtDecode(token);
  // console.log(`DECODED TOKEN RA ${ctx.user}`);
  return (
    <>
      <h1>Dashboard Page</h1>
      <h2>You are logged in as: {ctx.user.email}</h2>
    </>
  );
};

export default DashboardPage;
