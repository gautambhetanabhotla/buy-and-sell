import PageTemplate from "./pagetemplate.jsx";

const Support = ({ decodedToken }) => {
  return (
    <>
      <h1>Support Page</h1>
    </>
  );
};

const SupportPage = () => {
  return (
    <PageTemplate>
      <Support />
    </PageTemplate>
  );
};

export default SupportPage;
