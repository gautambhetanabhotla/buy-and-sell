// import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './navbar.tsx';
import LoginSignupPage from './pages/loginsignup.tsx';
import OrdersPage from './pages/orders.tsx';
import ItemsPage from './pages/items.tsx';
import DeliverPage from './pages/deliver.tsx';
import SupportPage from './pages/support.tsx';
import DashboardPage from './pages/dashboard.tsx';
import CartPage from './pages/cart.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" Component={LoginSignupPage}></Route>
          <Route path="/dashboard" Component={DashboardPage}></Route>
          <Route path="/items" Component={ItemsPage}></Route>
          <Route path="/orders" Component={OrdersPage}></Route>
          <Route path="/deliver" Component={DeliverPage}></Route>
          <Route path="/support" Component={SupportPage}></Route>
          <Route path="/cart" Component={CartPage}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
