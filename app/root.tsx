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
  "sk_test_51ONfq9AtHJUBJtRYhWTtjZnV9tUwsiUi8osmseF8juGY8if6K2qj2rAti6FbiLZIVIpfcck6jbvLD1Jhdb7gvNtg00e5iXSMgE"
);

export const loader = async function ({ request }) {
  return await createPaymentIntent();
} satisfies LoaderFunction;

export default function App() {
  const paymentIntent = useLoaderData<typeof loader>();
  console.log("paymentIntent", paymentIntent);
  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "sk_test_51ONfq9AtHJUBJtRYhWTtjZnV9tUwsiUi8osmseF8juGY8if6K2qj2rAti6FbiLZIVIpfcck6jbvLD1Jhdb7gvNtg00e5iXSMgE",
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
        <Link to="/pay">pay</Link>

        <Link to="/pay/success">success</Link>
        <Link to="/payments">payment</Link>
        <Elements stripe={stripePromise} options={options}>
          <Outlet />
        </Elements>
        <Scripts />
      </body>
    </html>
  );
}
// export default function App() {
//   return (
//     <html>
//       <head>
//         <link rel="icon" href="data:image/x-icon;base64,AA" />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <h1>Hello world!111111</h1>
//         <Link to="/pay">Pay</Link>
//         <Outlet />

//         <Scripts />
//       </body>
//     </html>
//   );
// }
