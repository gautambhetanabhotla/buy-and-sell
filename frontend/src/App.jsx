// import './App.css';
import { Route, Routes } from "react-router-dom";
// import { useState, useContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";

// import Navbar from './navbar.jsx';
import LoginSignupPage from "./pages/loginsignup.jsx";
import OrdersPage from "./pages/orders.jsx";
import ItemsPage from "./pages/items.jsx";
import DeliverPage from "./pages/deliver.jsx";
import SupportPage from "./pages/support.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import CartPage from "./pages/cart.jsx";

const App = () => {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" Component={LoginSignupPage}></Route>
        <Route path="/dashboard" Component={DashboardPage}></Route>
        <Route path="/items" Component={ItemsPage}></Route>
        <Route path="/orders" Component={OrdersPage}></Route>
        <Route path="/deliver" Component={DeliverPage}></Route>
        <Route path="/support" Component={SupportPage}></Route>
        <Route path="/cart" Component={CartPage}></Route>
      </Routes>
    </>
  );
};

export default App;
