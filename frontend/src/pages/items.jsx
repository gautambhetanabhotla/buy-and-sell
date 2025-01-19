import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

const Items = ({ decodedToken }) => {
  return (
    <>
      <h1>Items Page</h1>
    </>
  );
}

const ItemsPage = () => {
  return (
    <Protected>
      <Navbar />
      <Items />
    </Protected>
  );
};

export default ItemsPage;
