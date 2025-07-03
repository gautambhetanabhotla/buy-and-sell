import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Container, TextField, Button, Typography, Box } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { AuthContext } from "../auth.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    axios.post('/api/user/login', {
      email: email,
      password: password,
    })
    .then(response => {
      if(response.status === 200) {
        const Token = response.data.token;
        ctx.login(Token);
        setLoading(false);
        setIsError(false);
        navigate('/dashboard');
      }
    })
    .catch(error => {
      setLoading(false);
      setIsError(true);
      if(error.status === 401) {
        setErrorMsg("Invalid e-mail or password.");
      }
      else if(error.status === 500) {
        setErrorMsg("User does not exist.");
      }
    });
    // console.log(email, password);
    
  };
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        // onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 1 }}
        /><br />
        {isError && <Alert severity="error" sx={{ mt: 1 }}>
          {errorMsg}
        </Alert>}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
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
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = (event) => {
    event.preventDefault();
    setLoading(true);
    axios.post('/api/user/signup', {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      age: age,
      contactNumber: contactNumber,
    })
    .then(response => {
      setLoading(false);
      if(response.status === 200) {
        const Token = response.data.token;
        login(Token);
        navigate('/dashboard');
      }
      else if(response.status === 401) {
        console.log("Invalid email or password");
      }
    })
    .catch(error => {
      setLoading(false);
      setIsError(true);
      console.log(error.response.data.message);
      setErrorMsg(error.response.data.message);
      console.error(error);
    });
  };
  
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        // onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <form onSubmit={handleSignup}>
        <TextField
          type="text"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        /><br />
        <TextField
          type="text"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          type="number"
          label="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          type="number"
          label="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 1 }}
        /><br />
        {isError && <Alert severity="error" sx={{ mt: 1 }}>
          {errorMsg}
        </Alert>}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
      </form>
    </>
  );
}

const LoginSignupPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [isLogin, setIsLogin] = useState(queryParams.get('mode') !== 'signup');
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (ctx.user) navigate('/dashboard');
  }, [ctx.user, navigate]);
  
  return (
    <>
      <Container maxWidth="sm">
        {/* <Box sx={{ mt: 4 }}> */}
          <Box sx={{pt: 12}}/>
          <Typography variant="h4" component="h1" gutterBottom fontStyle={{ fontWeight: "bold" }}>
          {isLogin ? "Log in" : "Sign up"}
          </Typography>
          {isLogin ? <LoginForm /> : <SignupForm />}
          <Typography
            color="primary"
            onClick={() => setIsLogin(!isLogin)}
            sx={{
              cursor: "pointer",
              '&:hover': {
                textDecoration: "underline",
              },
              mt: 2,
            }}>
            {isLogin ? "Don't have an account yet? Sign up" : "Have an account already? Log in"}
          </Typography>
        {/* </Box> */}
      </Container>
    </>
  );
};

export default LoginSignupPage;
