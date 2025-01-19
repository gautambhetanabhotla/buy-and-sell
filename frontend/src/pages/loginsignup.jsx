import { useState, useContext } from "react";
// import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// // import User from '../user.tsx';
import { AuthContext } from "../auth.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = (event) => {
    event.preventDefault();
    // console.log(email, password);
    axios.post('/api/user/login', {
      email: email,
      password: password,
    })
    .then(response => {
      if(response.data.message === "Success") {
        // const decodedToken = jwtDecode(data.token);
        const Token = response.data.token;
        console.log('Token:', Token);
        login(Token);
        navigate('/dashboard');
      }
      else if(response.data.message === "Invalid email or password") {
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
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignup = (event) => {
    event.preventDefault();
    axios.post('/api/user/signup', {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      age: age,
      contactNumber: contactNumber,
    })
    .then(response => {
      if(response.data.message === "Success") {
        // const decodedToken = jwtDecode(response.data.token);
        const Token = response.data.token;
        console.log('Decoded Token:', Token);
        login(Token);
        navigate('/dashboard');
      }
      else if(response.data.message === "Invalid email or password") {
        console.log("Invalid email or password");
      }
    })
    .catch(error => {
      console.error(error);
    });
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [isLogin, setIsLogin] = useState(queryParams.get('mode') !== 'signup');
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
