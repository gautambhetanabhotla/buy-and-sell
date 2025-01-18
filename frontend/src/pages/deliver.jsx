import PageTemplate from "./pagetemplate.jsx";

const Deliver = ({ decodedToken }) => {
  return (
    <>
      <h1>Deliver Page</h1>
    </>
  );
}

const DeliverPage = () => {
  return (
    <PageTemplate>
      <Deliver />
    </PageTemplate>
  );
};

export default DeliverPage;
