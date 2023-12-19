import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51ONfq9AtHJUBJtRYhWTtjZnV9tUwsiUi8osmseF8juGY8if6K2qj2rAti6FbiLZIVIpfcck6jbvLD1Jhdb7gvNtg00e5iXSMgE"
);

export async function createPaymentIntent() {
  return await stripe.paymentIntents.create({
    amount: 2000,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function retrievePaymentIntent(id: string) {
  return await stripe.paymentIntents.retrieve(id);
}

export async function confirmPayment(request: Request) {
  const formData = await request.formData();
  console.log("formData", formData);
  console.log(formData);

  await confirmPayment(formData as any);
}
