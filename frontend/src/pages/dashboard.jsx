// import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// import { AuthContext } from "../auth.jsx";
import Navbar from "../navbar.jsx";
import Protected from "../auth.jsx";

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
    <Protected>
      <Navbar />
      {/* <h1>YOU ARE LOGGED IN AS {decodedToken.email}</h1> */}
      <Dashboard />
    </Protected>
  )
}

//  const DashboardPage2 = () => {
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
//       <Navbar logoutFn={logout} logoutFn={handleLogout}/>
//       <>
//         <h1>Dashboard Page</h1>
//         <h2>You are logged in as: {decodedToken.email}</h2>
//       </>
//     </>
//   );
// };

export default DashboardPage;
