import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventEmitter from "event-emitter";

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

  const [OTP, setOTP] = useState("");
  const [completeButtonLoading, setCompleteButtonLoading] = useState(false);

  const completeOrder = () => {
    setCompleteButtonLoading(true);
    axios.get('/api/order/' + order._id + '/regenerate').then(res => {
      // console.log(res.data.otp);
      setOTP(res.data.otp);
      setCompleteButtonLoading(false);
    }).catch(err => {
      console.error(err);
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

const Deliver = ({ decodedToken }) => {

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/order/to-deliver/100').then(res => {
      console.dir(res);
      setOrders(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

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
