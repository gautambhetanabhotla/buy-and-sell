import { useState, useContext } from "react";
// import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// // import User from '../user.tsx';
import { AuthContext } from "../auth.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = (event) => {
    // Handle login logic
    event.preventDefault();
    fetch('http://localhost:8080/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.message === "Success") {
        // const decodedToken = jwtDecode(data.token);
        const decodedToken = data.token;
        console.log('Decoded Token:', decodedToken);
        login(decodedToken);
        navigate('/dashboard');
      }
      else if(data.message === "Invalid email or password") {
        console.log("Invalid email or password");
      }
    })
    .catch(error => {
      console.error(error);
    });
    // console.log(email, password);
    setEmail("");
    setPassword("");
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
