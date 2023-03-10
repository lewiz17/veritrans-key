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
app.post('/api/key', async (req, res) => {

    const order = req.body.order_id;
    const amountTotal = req.body.amount;
    const name = req.body.name;
    const email = req.body.email;
    
    const data = {
        order_id: order,
        gross_amount: amountTotal,
        shipping_amount: 0,
        dummy: true,
        payment_key_expiry_duration: 1440,
        enabled_payment_types: ["card"],
        email: {
          customer_name: name,
          customer_email_address: email
        }
    };

    const config = {
        method: "post",
        url: `https://pay.veritrans.co.jp/pop/v1/payment-key`,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Basic MjI3ZDVkZmYtYzA5Yy00NzE4LTg3ZTMtYmJiNTI0NzAwZDQ4Og=="
        },
        data: JSON.stringify(data)
    };

    try {
        const response = await axios(config);
        res.status(200).json({ data: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});
