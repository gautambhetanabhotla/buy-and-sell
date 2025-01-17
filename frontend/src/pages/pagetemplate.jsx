import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../auth.jsx";
import Navbar from "../navbar.jsx";

const PageTemplate = ({ children }) => {
  const { decodedToken, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    // setLoggedOut();
    logout();
    navigate('/');
  }

  useEffect(() => {
    if (!loading && !decodedToken) {
      navigate('/');
    }
  }, [decodedToken, loading, navigate]);

  if (loading /* || loggedOut */ ) {
    return <p>Loading...</p>;
  }

  const childrenWithProps = React.Children.map(children, child => {
    return React.cloneElement(child, { decodedToken });
  });

  return (
    <>
      <Navbar logoutFn={handleLogout}/>
      { childrenWithProps }
    </>
  );
};

export default PageTemplate;