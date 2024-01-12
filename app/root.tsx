import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "./payments";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51ONfq9AtHJUBJtRYKJs2jqPiAak1bRN5i7Ygrk2u6MxH4sz3t3unQRbIdh6oGBs4LZnedBVroQAQM42wr83Xkkxz007nXv1FCN"
);

export const loader = async function ({ request }) {
  return await createPaymentIntent();
} satisfies LoaderFunction;

export default function App() {
  const paymentIntent = useLoaderData<typeof loader>();
  console.log("paymentIntent function App()", paymentIntent);
  const options = {
    // passing the client secret obtained from the server
    clientSecret: paymentIntent.client_secret,
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Hello world!111111</h1>
        <div>
          <Link to="/pay">pay</Link>
        </div>
        <div>
          <Link to="/pay/success">success</Link>
        </div>
        <div>
          <Link to="/payments">payment</Link>
        </div>
        <Elements stripe={stripePromise} options={options}>
          <Outlet />
        </Elements>
        <Scripts />
      </body>
    </html>
  );
}
