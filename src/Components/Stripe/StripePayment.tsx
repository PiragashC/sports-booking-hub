import { Elements } from "@stripe/react-stripe-js";
import { Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

type StripePaymentProps = {
  stripePromise: Promise<Stripe | null>;
  clientSecret: string;
};

const StripePayment: React.FC<StripePaymentProps> = ({ stripePromise, clientSecret }) => {
  const options: StripeElementsOptions = { clientSecret };
  

  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </>
  );
};

export default StripePayment;
