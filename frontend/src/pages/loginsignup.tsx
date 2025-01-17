import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

// import User from '../user.tsx';
import { AuthContext } from '../auth.tsx';

const LoginSignupPage = () => {
  const context = useContext(AuthContext);
  if (context?.isAuthenticated) {
    return (
      <>
        <Navigate to="/dashboard" />
      </>
    );
  }
  return (
    <>
      <h1>LoginSignupPage</h1>
    </>
  );
};

export default LoginSignupPage;
