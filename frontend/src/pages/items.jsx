import Protected, {AuthContext} from "../auth.jsx";
import Navbar from "../navbar.jsx";

import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Typography,
         Card,
         CardContent,
         CardActions,
         Grid2 as Grid,
         Button,
         Autocomplete,
         TextField,
         Select,
         MenuItem,
         OutlinedInput,
         Box,
         Chip,
         Container } from "@mui/material";

const Item = () => {
  const [item, setItem] = useState({});
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  const ctx = useContext(AuthContext);
  
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
    <div style={{ display: 'flex', justifyContent: 'center', alighItems: 'center', width: '70%', margin: 'auto' }}>
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
          {(ctx.user.id != item.seller) && <Button onClick={addToCart}>Add to Cart</Button>}
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
  const [selectedItemName, setSelectedItemName] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSelectedCategoryChange = (event) => {
    const { target: { value } } = event;
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  useEffect(() => {
    axios.get('/api/item/limit/100').then((response) => {
      console.dir(response.data);
      setItems(response.data);
      setAvailableCategories([...new Set(response.data.map(item => item.category).flat())]);
    }).catch((error) => {
      console.log(error);
    });
  }, []); // Fetch all items for sale on page load

  return (
    <>
      <Typography variant="h2" pt={8} pl={3}>Browse items</Typography>
      <Container>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6} lg={6} xl={6} minWidth={400}>
            <Autocomplete
              variant="flat"
              options={items.map((item) => item.name)}
              renderInput={(params) => (
                <TextField {...params} label="Search items" variant="outlined" fullWidth />
              )}
              onInputChange={(e, v) => setSearchQuery(v)}
              onChange={(e, v) => setSelectedItemName(v)}
              inputValue={searchQuery}
              value={selectedItemName}
              fullWidth
            />
          </Grid>
          <Grid item sm={12} md={6} lg={6} xl={6} minWidth={400}>
            <Select
              label="Categories"
              minWidth={200}
              multiple
              value={selectedCategories}
              onChange={handleSelectedCategoryChange}
              input={<OutlinedInput label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {availableCategories.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid container spacing={2} mt={5} size={{ xs: 12, sm: 6 }}>
          {items.filter(
            item => (item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    || item.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    &&
                    (selectedCategories.length === 0 || selectedCategories.some(category => item.category.includes(category)))
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
      </Container>
      
    </>
  );
}

const ItemsPage = ({ decodedToken }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return (
    <Protected>
      <Navbar />
      {queryParams.get('item') ? <Item decodedToken={decodedToken}/> : <Items />}
    </Protected>
  );
};

export default ItemsPage;
