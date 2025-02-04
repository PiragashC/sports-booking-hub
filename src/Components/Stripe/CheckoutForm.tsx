import { PaymentElement } from "@stripe/react-stripe-js";
import { useState, FormEvent } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "primereact/button";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    setMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" className="payment_form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />

      <div className="payment_btn_area">
        <Button
          id="submit"
          label={isProcessing ? "Processing ... " : "Pay Now"}
          className="custom_btn primary"
          loading={isProcessing}
          disabled={isProcessing || !stripe || !elements}
        />
      </div>

      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}