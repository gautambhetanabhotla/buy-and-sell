import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ctx, decodedToken}) => {
  const navigate = useNavigate();
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
        <li>
          <button onClick={() => {ctx.logout(); console.log("navigating"); navigate('/?mode=login')}}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
