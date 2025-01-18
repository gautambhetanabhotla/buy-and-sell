// import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// import { AuthContext } from "../auth.jsx";
// import Navbar from "../navbar.jsx";
import PageTemplate from "./pagetemplate.jsx";

const Dashboard = ({ decodedToken }) => {
  return (
    <>
      <h1>DashboardPage</h1>
      <h2>You are logged in as: {decodedToken.email}</h2>
    </>
  );
}

const DashboardPage = () => {
  return (
    <PageTemplate>
      <Dashboard />
    </PageTemplate>
  )
}

// const DashboardPage2 = () => {
//   const { decodedToken, loading, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   // const [loggedOut, setLoggedOut] = useState(false);

//   const handleLogout = () => {
//     // setLoggedOut();
//     logout();
//     navigate('/');
//   }

//   useEffect(() => {
//     if (!loading && !decodedToken) {
//       navigate('/');
//     }
//   }, [decodedToken, loading, navigate]);

//   if (loading /* || loggedOut */ ) {
//     return <p>Loading...</p>;
//   }
//   // TO DO: Fix the rendering after navigation issue
//   return (
//     <>
//       <Navbar logoutFn={handleLogout}/>
//       <>
//         <h1>Dashboard Page</h1>
//         <h2>You are logged in as: {decodedToken.email}</h2>
//       </>
//     </>
//   );
// };

export default DashboardPage;
