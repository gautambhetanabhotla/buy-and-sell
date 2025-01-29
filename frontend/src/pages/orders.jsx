import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid2 as Grid,
  Box,
  Button,
  TextField } from "@mui/material";

const OrderCard = ({ order }) => {

  const navigate = useNavigate();

  const [OTP, setOTP] = useState("******");
  const [OTPbuttonLoading, setOTPbuttonLoading] = useState(false);

  const regenerateOTP = () => {
    setOTPbuttonLoading(true);
    axios.get('/api/order/' + order._id + '/regenerate').then(res => {
      // console.log(res.data.otp);
      setOTP(res.data.otp);
      setOTPbuttonLoading(false);
    }).catch(err => {
      console.error(err);
      setOTPbuttonLoading(false);
    });
  };

  // const cancelOrder = () => {
  //   axios.post('/api/order/cancel' + order._id).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.error(err);
  //   });
  // }

  const regenerateButtonProps = {
    onClick: regenerateOTP,
    loading: OTPbuttonLoading,
  }

  return (
    <>
      <Card>
        <Grid container justifyContent={"space-between"}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <CardContent>
              <Typography variant="h5">Item: {order.item.name}</Typography>
              <Typography variant="subtitle2">Price: {order.item.price}</Typography>
              <Typography variant="subtitle2">Status: {order.status}</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => navigate('/items?item=' + order.item._id)}><Typography>View</Typography></Button>
              {/* <Button><Typography>Cancel order</Typography></Button> */}
            </CardActions>
          </Grid>
          <Grid item>
            <CardContent>
              <Typography variant="h4" pb={2}>OTP</Typography>
              <TextField
                variant="standard"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                disabled
              />
            </CardContent>
            <CardActions>
              <Button {...regenerateButtonProps}><Typography>Regenerate</Typography></Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

const Orders = () => {

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/order/limit/100').then(res => {
      setOrders(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <>
      <Typography variant="h2" pt={8} pl={4}>Orders</Typography>
      <Box padding={'5vw'}>
        {orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </Box>
    </>
  );
}

const OrdersPage = () => {
  return (
    <Protected>
      <Navbar />
      <Orders />
    </Protected>
  );
};

export default OrdersPage;
