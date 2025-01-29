import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid2 as Grid,
  Box,
  Button,
  TextField,
  ButtonGroup } from "@mui/material";

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
      <Card mt={4} mb={4}>
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
          { order.status === "pending" &&
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
        }
        </Grid>
      </Card>
    </>
  );
};

const PendingOrders = () => {

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/order/pending/100').then(res => {
      setOrders(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <>
      <Typography variant="h2" pt={4} pl={4}>Pending Orders</Typography>
      <Box padding={'5vw'}>
        {orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </Box>
    </>
  );
}

const ReceivedOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/order/received/100').then(res => {
      setOrders(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <>
      <Typography variant="h2" pt={4} pl={4}>Received Orders</Typography>
      <Box padding={'5vw'}>
        {orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </Box>
    </>
  );
}

const DeliveredOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/order/delivered/100').then(res => {
      setOrders(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <>
      <Typography variant="h2" pt={4} pl={4}>Delivered Orders</Typography>
      <Box padding={'5vw'}>
        {orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </Box>
    </>
  );
}

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const string = queryParams.get('orders');
  return (
    <Protected>
      <Navbar />
      <Box pt={9} justifyContent={"center"} alignItems={"center"} display={"flex"}>
        <ButtonGroup row>
          <Button
            variant={!string ? "contained" : (string === "pending" ? "contained" : "outlined")}
            onClick={() => navigate('/orders?orders=pending')}
          >
            Pending
          </Button>
          <Button
            variant={!string ? "outlined" : string === "received" ? "contained" : "outlined"}
            onClick={() => navigate('/orders?orders=received')}
          >
            Received
          </Button>
          <Button 
            variant={!string ? "outlined" : string === "delivered" ? "contained" : "outlined"}
            onClick={() => navigate('/orders?orders=delivered')}
          >
            Delivered
          </Button>
        </ButtonGroup>
      </Box>
      {string ? (string === "received" ? <ReceivedOrders /> : (string === "delivered") ? <DeliveredOrders /> : <PendingOrders />)  : <PendingOrders />}
    </Protected>
  );
};

export default OrdersPage;
