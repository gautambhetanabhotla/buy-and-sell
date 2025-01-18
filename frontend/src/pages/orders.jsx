import PageTemplate from "./pagetemplate.jsx";

const Orders = ({ decodedToken }) => {
  return (
    <>
      <h1>Orders Page</h1>
    </>
  );
}

const OrdersPage = () => {
  return (
    <PageTemplate>
      <Orders />
    </PageTemplate>
  );
};

export default OrdersPage;
