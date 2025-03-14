import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

import axios from "axios";
import { useState, useEffect } from "react";
import { Typography, Card, CardContent, CardActions, Grid2 as Grid, Button } from "@mui/material";

const Cart = ({ decodedToken }) => {

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios.get("/api/user/" + decodedToken.id + "/cart")
      .then((response) => {
        console.dir(response);
        setCartItems(response.data);
        // console.dir(cartItems);
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [decodedToken.id]);

  const removeFromCart = (itemID) => {
    axios.delete("/api/user/" + decodedToken.id + "/cart/" + itemID)
      .then((response) => {
        console.dir(response);
        setCartItems(cartItems.filter(item => item._id !== itemID));
      })
      .catch((error) => {
        console.dir(error);
      });
  };

  const checkout = () => {
    axios.post('/api/order/place', cartItems).then((response) => {
      console.log('Order: ');
      console.dir(response);
      setCartItems([]);
    });
  };

  return (
    <>
      <Typography variant="h2" pt={8}>Cart</Typography>
      <Grid container spacing={2} justifyContent="space-around" xs={12} sm={6} md={6} lg={6}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {cartItems.map((item) => (
            <Card key={item._id}>
              <Grid container xs={12} sm={12} md={12} lg={12}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <CardContent>
                    <Typography variant="h5">{item.name}</Typography>
                    <Typography variant="h6">{item.price}</Typography>
                  </CardContent>
                </Grid>
                <Grid item>
                  <CardActions>
                    <Button onClick={() => removeFromCart(item._id)}>Remove</Button>
                  </CardActions>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="h3">Total: {cartItems.reduce((acc, item) => acc + item.price, 0)}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={checkout}>Checkout</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

const CartPage = () => {
  return (
    <Protected>
      <Navbar />
      <Cart />
    </Protected>
  );
};

export default CartPage;
