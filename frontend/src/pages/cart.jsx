import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
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
  return (
    <>
      <h1>Cart Page</h1>
    </>
  );
};

export default CartPage;
