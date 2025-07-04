import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import Container from '@mui/material/Container';

import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/TravelExplore';
import OrdersIcon from '@mui/icons-material/Grading';
import DeliverIcon from '@mui/icons-material/DeliveryDining';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LogoutIcon from '@mui/icons-material/Logout';

import { AuthContext } from "./auth.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname.split('/')[1]);
  const ctx = useContext(AuthContext);
  return (
    <BottomNavigation
    showLabels
    value={value}
    sx={{
      width: '100%',
      position: 'fixed',
      backgroundColor: '#111111',
    }}
    onChange={(event, newValue) => {
      setValue(newValue);
      if(newValue === "logout") {
        ctx.logout();
        navigate('/?mode=login');
      }
      else navigate('/' + newValue);
    }}
    >
      <BottomNavigationAction label="Dashboard" value="dashboard" icon={<DashboardIcon />} />
      <BottomNavigationAction label="Search Items" value="items" icon={<SearchIcon />} />
      <BottomNavigationAction label="Orders" value="orders" icon={<OrdersIcon />} />
      <BottomNavigationAction label="Deliver" value="deliver" icon={<DeliverIcon />} />
      <BottomNavigationAction label="Cart" value="cart" icon={<ShoppingCartIcon />} />
      <BottomNavigationAction label="Support" value="support" icon={<ContactSupportIcon />} />
      <BottomNavigationAction label="Logout" value="logout" icon={<LogoutIcon />} />
    </BottomNavigation>
  );
}

export default Navbar;
