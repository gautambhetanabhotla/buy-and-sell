import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

const Support = ({ decodedToken }) => {
  return (
    <>
      <h1>Support Page</h1>
    </>
  );
};

const SupportPage = () => {
  return (
    <Protected>
      <Navbar />
      <Support />
    </Protected>
  );
};

export default SupportPage;
