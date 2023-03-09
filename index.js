require("dotenv").config();
const express = require("express");
const axios = require("axios");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

const port = 3001;

/** Endpoint for payment key veritrans generate */
app.post('/api/vtkey', async (req, res) => {

    const order = req.body.order_id;
    const amountTotal = req.body.amount;

    const generateOrderId = () => {
        return `ORDER-${uuid.v4()}`;
    };
    
    const data = {
        order_id: order,
        gross_amount: amountTotal,
        shipping_amount: 0,
        dummy: true,
        payment_key_expiry_duration: 1440,
        enabled_payment_types: ["card"],
    };

    const config = {
        method: "post",
        url: `https://pay.veritrans.co.jp/pop/v1/payment-key`,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Basic MjI3ZDVkZmYtYzA5Yy00NzE4LTg3ZTMtYmJiNTI0NzAwZDQ4Og=="
        },
        data: data,
    };

    try {
        const response = await axios(config);
        console.log(response);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});



app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});
