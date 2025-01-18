import PageTemplate from "./pagetemplate.jsx";

const Cart = ({ decodedToken }) => {
  return (
    <>
      <h1>Cart Page</h1>
    </>
  );
};

const CartPage = () => {
  return (
    <PageTemplate>
      <Cart />
    </PageTemplate>
  );
};

export default CartPage;
