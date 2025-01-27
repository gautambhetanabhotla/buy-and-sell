import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Typography, Card, CardContent, CardActions, Grid2 as Grid, Button, Autocomplete, TextField } from "@mui/material";

const Item = () => {
  const [item, setItem] = useState({});
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    axios.get('/api/item/' + queryParams.get('item')).then((response) => {
      // console.dir(response.data);
      setItem(response.data);
      setCategories(response.data.category);
    }).catch((error) => {
      console.log(error);
    });
  }, [location]);

  const addToCart = () => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('item');
    axios.post('/api/item/addtocart/' + id).then((response) => {
      console.dir(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
  <>
    {/* <Typography variant="h2">Item</Typography> */}
    <div style={{ display: 'flex', justifyContent: 'center', width: '70%' }}>
      <Card sx={{ minWidth: '30%', mt: '8%' }}>
        <CardContent sx={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <Typography variant="h3">{item.name}</Typography>
          <Typography variant="body1" mt={3}>{item.description}</Typography>
          <Typography variant="body2" mt={5}>
            Categories: {
              categories.map((category, idx) => category + (idx < item.category.length - 1 ? ', ' : ''))
            }
          </Typography>
          <Typography variant="h5" mt={5}>₹{item.price}</Typography>
        </CardContent>
        <CardActions>
          <Button onClick={addToCart}>Add to Cart</Button>
        </CardActions>
      </Card>
    </div>
  </>
  );
};

const Items = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  useEffect(() => {
    axios.get('/api/item/limit/100').then((response) => {
      console.dir(response.data);
      setItems(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);
  return (
    <>
      <Typography variant="h2" pt={8}>Browse items</Typography>
      <Autocomplete
        variant="flat"
        options={items.map((item) => item.name)}
        renderInput={(params) => (
          <TextField {...params} label="Search items" variant="outlined" />
        )}
        onInputChange={(e, v) => setSearchQuery(v)}
        onChange={(e, v) => setSelectedValue(v)}
        inputValue={searchQuery}
        value={selectedValue}
        zindex={-10000}
      />
      <Grid container spacing={2} size={{ xs: 12, sm: 6 }}>
        {items.filter(
          item => item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  || item.description.toLowerCase().includes(searchQuery.toLowerCase())
                  || item.category.some(category => category.toLowerCase().includes(searchQuery.toLowerCase()))
          ).map((item) => (
          <Card key={item._id}>
            <CardContent>
              <Typography variant="h5">{item.name}</Typography>
              <Typography variant="body1">{item.description}</Typography>
              <Typography variant="subtitle2" pt={2}>
                Categories: {item.category.map((category, idx) => 
                  category + (idx < item.category.length - 1 ? ', ' : ''))
                }
              </Typography>
              <Typography variant="subtitle2">Seller: {item.sellerDetails.firstName} {item.sellerDetails.lastName}</Typography>
            </CardContent>
            <CardActions>
            <Typography variant="body1">₹{item.price}</Typography>
              <Button onClick={() => navigate('/items?item=' + item._id)}>View</Button>
            </CardActions>
          </Card>
        ))}
      </Grid>
    </>
  );
}

const ItemsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return (
    <Protected>
      <Navbar />
      {queryParams.get('item') ? <Item /> : <Items />}
    </Protected>
  );
};

export default ItemsPage;
