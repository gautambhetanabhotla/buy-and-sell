import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

const Cart = ({ decodedToken }) => {
  return (
    <>
      <h1>Cart Page</h1>
    </>
  );
};

const CartPage = () => {
  return (
    <Protected>
      <Navbar />
      <Cart />
    </Protected>
  );
};

export default CartPage;
