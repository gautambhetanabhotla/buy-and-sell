import { NavLink } from "react-router-dom";

const Navbar = ({logoutFn}) => {
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
          <button onClick={logoutFn}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
