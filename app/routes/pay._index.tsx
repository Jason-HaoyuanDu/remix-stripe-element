import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { confirmPayment } from "~/payments";

export const action = async function ({ request }) {
  await confirmPayment(request);

  return redirect("/pay/success");
} satisfies ActionFunction;

export default function PayForm() {
  const submit = useSubmit();
  const stripe = useStripe();
  const elements = useElements();

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
      // Show error to your customer (for example, payment details incomplete)
      alert(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    submit(event.currentTarget, { replace: true });
  };

  return (
    <Form method="post" onSubmit={handleChange}>
      <h1>Payoooo</h1>
      <div style={{ padding: "20px" }}>
        <PaymentElement />
      </div>

      <p>
        <button type="submit">Pay</button>
      </p>
    </Form>
  );
}
