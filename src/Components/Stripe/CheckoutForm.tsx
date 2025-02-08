import { PaymentElement } from "@stripe/react-stripe-js";
import { useState, FormEvent } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "primereact/button";
import { PaymentIntent } from "@stripe/stripe-js";

interface CheckoutFormProps {
  onPaymentComplete: (paymentIntent: PaymentIntent | undefined) => void;
  onPauseTimer: () => void;  // Function to pause timer
  onResumeTimer: () => void; // Function to resume timer
}

export default function CheckoutForm({ onPaymentComplete, onPauseTimer, onResumeTimer }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage("");

    // Pause the timer when the user starts payment
    onPauseTimer();

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // No need for return_url, we handle it via the function
      },
      redirect: "if_required", // Prevent automatic redirect
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
      onResumeTimer(); // Resume timer if payment fails
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Call the passed function with paymentIntent ID
      onPaymentComplete(paymentIntent);
    } else {
      setMessage("Payment was not completed.");
      onResumeTimer(); // Resume timer if payment fails
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