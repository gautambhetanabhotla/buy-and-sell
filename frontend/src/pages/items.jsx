import PageTemplate from "./pagetemplate.jsx";

const Items = ({ decodedToken }) => {
  return (
    <>
      <h1>Items Page</h1>
    </>
  );
}

const ItemsPage = () => {
  return (
    <PageTemplate>
      <Items />
    </PageTemplate>
  );
};

export default ItemsPage;
