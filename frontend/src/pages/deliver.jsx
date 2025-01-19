import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

const Deliver = ({ decodedToken }) => {
  return (
    <>
      <h1>Deliver Page</h1>
    </>
  );
}

const DeliverPage = () => {
  return (
    <Protected>
      <Navbar />
      <Deliver />
    </Protected>
  );
};

export default DeliverPage;
