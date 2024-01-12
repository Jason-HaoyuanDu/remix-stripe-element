import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { confirmPayment } from "~/payments";

export const action = async function ({ request }) {
  console.log("call action", request);
  await confirmPayment(request);

  return redirect("/pay/success");
} satisfies ActionFunction;

export default function PayForm() {
  const submit = useSubmit();
  const stripe = useStripe();
  const elements = useElements();
  const stripe2 = require("stripe")(
    "sk_test_51ONfq9AtHJUBJtRYhWTtjZnV9tUwsiUi8osmseF8juGY8if6K2qj2rAti6FbiLZIVIpfcck6jbvLD1Jhdb7gvNtg00e5iXSMgE"
  );
  const [paymentIntents, setPaymentIntents] = useState([]);
  const [updatedPaymentIntent, setUpdatedPaymentIntent] = useState();
  const [selectedOPaymentIntent, setSelectedOPaymentIntent] = useState();
  const handleChange = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or elements not loaded");
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/pay/success",
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    submit(event.currentTarget, { replace: true });
  };

  const checkForPaymentIntents = async () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const startOfDayTimestamp = now.getTime() / 1000;

    const paymentIntents = await stripe2.paymentIntents.list({
      created: { gte: startOfDayTimestamp },
    });
    const newArray = paymentIntents.data.map((obj) => ({
      id: obj.id,
      amount: obj.amount,
    }));
    setPaymentIntents(newArray);
  };

  const capturePaymentIntents = async (paymentIntents: any) => {
    for (let i = 0; i < paymentIntents.length; i++) {
      const paymentIntentId = paymentIntents[i].id;
      const result = await stripe2.paymentIntents.capture(paymentIntentId);
      setUpdatedPaymentIntent(result);
    }
  };

  const updatePaymentIntent = async (id) => {
    const targetAmount = paymentIntents.find(
      (paymentIntent) => paymentIntent.id == id
    )?.amount;

    const result = await stripe2.paymentIntents.update(id, {
      amount: targetAmount + 1000,
      receipt_email: "hdu@ikarusdev.ca",
      metadata: {
        order_id: "00001",
        receipt_email: "hdu@ikarusdev.ca",
      },
    });
    setUpdatedPaymentIntent(result);
    checkForPaymentIntents();
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "grey",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Form method="post" onSubmit={handleChange}>
        <h1>Payment Form</h1>
        <div style={{ width: 500 }}>
          <PaymentElement id="payment-element" />
        </div>

        <p>
          <button type="submit">Pay</button>
        </p>
      </Form>
      <button onClick={checkForPaymentIntents}>Check all paymentIntents</button>
      <div style={{ marginTop: "20px" }}>
        {paymentIntents.map((paymentIntent) => (
          <div
            key={paymentIntent.id}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              ==={paymentIntent.id}, {paymentIntent.amount}````
            </p>
            <button
              onClick={() => {
                // setSelectedOPaymentIntent(paymentIntent.id);
                updatePaymentIntent(paymentIntent.id);
              }}
            >
              update
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => capturePaymentIntents(paymentIntents)}>
          Capture all the paymentIntents
        </button>
      </div>
    </div>
  );
}
