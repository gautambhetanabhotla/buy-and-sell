import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

import axios from "axios";
import { useState, useEffect } from "react";
import { Typography, Card, CardContent, CardActions, Grid2 as Grid, Button, Container } from "@mui/material";

const Cart = ({ decodedToken }) => {

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios.get("/api/user/" + decodedToken.id + "/cart")
      .then((response) => {
        console.dir(response);
        setCartItems(response.data);
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

  };

  return (
    <>
      {/* <Container top={10} pt={10} sx={{height: 50, top: 10}}/> */}
      <Typography variant="h2" pt={8}>Cart</Typography>
      {cartItems.map((item) => (
        <Card key={item._id}>
          <Grid container>
            <Grid item>
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
      <Button variant="contained" onClick={checkout}>Checkout</Button>
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
