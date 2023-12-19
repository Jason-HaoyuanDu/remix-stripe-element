import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "~/payments";

const stripePromise = loadStripe(
  "sk_test_51ONfq9AtHJUBJtRYhWTtjZnV9tUwsiUi8osmseF8juGY8if6K2qj2rAti6FbiLZIVIpfcck6jbvLD1Jhdb7gvNtg00e5iXSMgE"
);

export const loader = async function ({ request }) {
  return await createPaymentIntent();
} satisfies LoaderFunction;

export default function Payments() {
  const paymentIntent = useLoaderData<typeof loader>();
  console.log("paymentIntent", paymentIntent);
  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "sk_test_51ONfq9AtHJUBJtRYhWTtjZnV9tUwsiUi8osmseF8juGY8if6K2qj2rAti6FbiLZIVIpfcck6jbvLD1Jhdb7gvNtg00e5iXSMgE",
  };

  return (
    <div style={{ padding: "20px" }}>
      <Elements stripe={stripePromise} options={options}>
        <Outlet />
      </Elements>
    </div>
  );
}
