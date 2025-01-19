import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

const Orders = ({ decodedToken }) => {
  return (
    <>
      <h1>Orders Page</h1>
    </>
  );
}

const OrdersPage = () => {
  return (
    <Protected>
      <Navbar />
      <Orders />
    </Protected>
  );
};

export default OrdersPage;
