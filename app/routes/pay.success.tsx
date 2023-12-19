import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrievePaymentIntent } from "~/payments";

export const loader = async function ({ request }) {
  console.log("request", new URL(request.url));
  console.log(
    'url.searchParams.get("payment_intent")',
    new URL(request.url).searchParams.get("payment_intent")
  );
  // const url = new URL(request.url);
  // const paymentIntentId = url.searchParams.get("payment_intent");
  // return await retrievePaymentIntent(paymentIntentId!);
  return true;
} satisfies LoaderFunction;

export default function Success() {
  // const paymentIntent = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Success</h1>
      <p>
        You have successfully paid for your order. Thank you for your purchase.
      </p>
      {/* <p>PaymenIntent: {paymentIntent.status}</p> */}
    </div>
  );
}
