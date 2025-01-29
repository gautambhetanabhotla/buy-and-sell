import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventEmitter from "eventemitter3";

import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid2 as Grid,
  Box,
  Button,
  TextField,
  Alert } from "@mui/material";

const eventEmitter = new EventEmitter();

const OrderCard = ({ order }) => {

  const navigate = useNavigate();

  const [OTP, setOTP] = useState("");
  const [completeButtonLoading, setCompleteButtonLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const completeOrder = () => {
    setCompleteButtonLoading(true);
    axios.post('/api/order/' + order._id + '/complete', {
      // id: order._id,
      otp: OTP,
    }).then(res => {
      console.log('STATUSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs: ');
      console.dir(res);
      setCompleteButtonLoading(false);
      if(res.status === 200) {
        eventEmitter.emit('order-completed', {
          id: order._id,
        });
      }
    }).catch(res => {
      if(res.status === 403) {
        setErrorMsg("Invalid OTP.");
      }
      else {
        setErrorMsg("An error occurred. Please try again later.");
      }
      setCompleteButtonLoading(false);
    });
  };

  const completeButtonProps = {
    onClick: completeOrder,
    loading: completeButtonLoading,
  }

  return (
    <>
      <Card>
        <Grid container justifyContent={"space-between"}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <CardContent>
              <Typography variant="h4">Item: {order.item.name}</Typography>
              <Typography variant="h5">Buyer: {order?.buyer?.firstName}</Typography>
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
              />
              {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            </CardContent>
            <CardActions>
              <Button {...completeButtonProps}><Typography>Complete order</Typography></Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

const Deliver = () => {

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/order/to-deliver/100').then(res => {
      // console.dir(res);
      setOrders(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  eventEmitter.on('order-completed', ({ id }) => {
    setOrders(orders.filter(order => order._id !== id));
  });

  return (
    <>
      <Typography variant="h2" pt={8} pl={4}>Deliver</Typography>
      <Box padding={'5vw'}>
        {orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </Box>
    </>
  );
}

const DeliverPage = () => {
  return (
    <Protected>
      <Navbar />
      <Deliver />
    </Protected>
  );
};

export default DeliverPage;
