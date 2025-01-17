import { useState } from "react";
// import { Navigate } from "react-router-dom";

// // import User from '../user.tsx';
// import { AuthContext } from "../auth.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (event) => {
    // Handle login logic
    event.preventDefault();
  };
  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const handleSignup = (event) => {
    // Handle signup logic
    event.preventDefault();
    console.log(firstName, lastName, email, age, contactNumber, password);
    setFirstName("");
    setLastName("");
    setEmail("");
    setAge("");
    setContactNumber("");
    setPassword("");
  };
  return (
    <>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        /><br />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        /><br />
        <input
          type="number"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      <h1>Login/Sign up</h1>
      {isLogin ? <LoginForm /> : <SignupForm />}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Sign up" : "Login"}
      </button>
    </>
  );
};

export default LoginSignupPage;
