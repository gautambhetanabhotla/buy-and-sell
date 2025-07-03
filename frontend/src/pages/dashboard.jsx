import { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { AuthContext } from "../auth.jsx";
import Navbar from "../navbar.jsx";
import Protected from "../auth.jsx";

import { Typography,
         Grid2 as Grid,
         TextField,
         Button,
         Backdrop,
         CircularProgress,
         List,
         ListItem } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserDetailsForm = () => {

  const ctx = useContext(AuthContext);

  const [firstName, setFirstName] = useState(ctx.user.firstName || "");
  const [lastName, setLastName] = useState(ctx.user.lastName || "");
  const [email, setEmail] = useState(ctx.user.email || "");
  const [age, setAge] = useState(ctx.user.age || "");
  const [contactNumber, setContactNumber] = useState(ctx.user.contactNumber || "");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios.put('/api/user/' + ctx.user.id, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      age: age,
      contactNumber: contactNumber,
      password: password,
    })
    .then(response => {
      setLoading(false);
      console.log(response);
      ctx.login(response.data.token);
    })
    .catch(error => {
      setLoading(false);
      console.log(error);
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
      <Typography variant="h4" sx={{ mt: 5 }}>User Details</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          label="E-mail"
          value={email}
          type="email"
          onChange={(event) => setEmail(event.target.value )}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          label="Age"
          value={age}
          type="number"
          onChange={(event) => setAge(event.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          label="Contact Number"
          value={contactNumber}
          type="number"
          onChange={(event) => setContactNumber(event.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          label="Change Password"
          value={password}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
      </form>
    </>
  );
};

const ItemUploadForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const { user } = useContext(AuthContext);

  const uploadItem = () => {
    axios.post('/api/item', {
      name: name,
      price: price,
      description: description,
      category: categories,
      seller: user.id,
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <>
      <Typography variant="h4" sx={{ mt: 5 }}>Put an item up for sale</Typography>
      <form onSubmit={uploadItem}>
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          label="Price"
          value={price}
          type="number"
          onChange={(event) => setPrice(event.target.value)}
          sx={{ mt: 1 }}
        /><br />
        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value )}
          sx={{ mt: 1 }}
        /><br />
        <List
          label="Age"
          sx={{ mt: 1 }}
        >
          <Typography variant="h6">Categories</Typography>
          {
            categories.map((item, index) => {
              console.dir(item);
              return <ListItem key={index}>{item}</ListItem>;
            })
          }
          <TextField
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            size="small"
            label="Add a category"
          />
          <Button
            // variant="contained"
            onClick={() => {
              if (category === "") return;
              setCategories([...categories, category]);
              setCategory("");
            }}
          ><AddIcon /></Button>
          <Button
            // variant="contained"
            onClick={() => {
              setCategories([]);
              setCategory("");
            }}
          ><DeleteIcon /></Button>
        </List><br />
        
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
      </form>
    </>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Typography variant="h2" pt={8}>Welcome, {user.firstName}!</Typography>
      <Grid container spacing={2} justifyContent={"space-around"}>
        <Grid xs={12} sm={6}>
          <UserDetailsForm />
        </Grid>
        <Grid xs={12} sm={6}>
          <ItemUploadForm />
        </Grid>
      </Grid>
    </>
  );
};

const DashboardPage = () => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown, {capture: true});
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
  return (
    <Protected>
      <Navbar />
      <Dashboard />
    </Protected>
  )
};

export default DashboardPage;
