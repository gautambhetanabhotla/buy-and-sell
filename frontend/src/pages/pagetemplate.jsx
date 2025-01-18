import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../auth.jsx";
import Navbar from "../navbar.jsx";

const PageTemplate = ({ children }) => {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  // const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    // setLoggedOut();
    ctx.logout();
    navigate('/');
  }

  useEffect(() => {
    console.log("DECODED TOKEN EVALUATED AT PAGE LOAD", ctx.decodedToken);
    // while(loading);
    while(ctx.loading) console.log("loading state ", ctx.loading);
    if (!ctx.loading && !ctx.decodedToken) {
      navigate('/');
    }
  }, [ctx, navigate]);

  if (ctx.loading /* || loggedOut */ ) {
    return <p>Loading...</p>;
  }

  const decodedToken = ctx.decodedToken;
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