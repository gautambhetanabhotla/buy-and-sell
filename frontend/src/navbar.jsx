import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import { AuthContext } from "./auth.jsx";

const Navbar = () => {
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
    <nav>
      <ul>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/items">Search Items</NavLink>
        </li>
        <li>
          <NavLink to="/orders">Orders</NavLink>
        </li>
        <li>
          <NavLink to="/deliver">Deliver</NavLink>
        </li>
        <li>
          <NavLink to="/cart">Cart</NavLink>
        </li>
        <li>
          <NavLink to="/support">Support</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
