import { Elements } from "@stripe/react-stripe-js";
import { PaymentIntent, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useEffect, useState } from "react";

type StripePaymentProps = {
  stripePromise: Promise<Stripe | null>;
  clientSecret: string;
  onPaymentComplete: (paymentIntent: PaymentIntent | undefined) => void;
  handleClose: () => void; // To close modal when time expires
  changeBookingStatus: (status: string) => void; // To update booking status
};

const StripePayment: React.FC<StripePaymentProps> = ({ stripePromise, clientSecret, onPaymentComplete, handleClose, changeBookingStatus }) => {
  const options: StripeElementsOptions = { clientSecret };

  // Timer state
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isPaused, setIsPaused] = useState(false); // To pause timer when user clicks "Pay Now"

  useEffect(() => {
    if (isPaused) return; // Pause timer when needed

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // changeBookingStatus("FAILURE"); // Mark booking as failed
          handleClose(); // Close modal
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [isPaused]);

  // Function to pause timer when "Pay Now" is clicked
  const handlePauseTimer = () => setIsPaused(true);

  // Function to resume timer if payment fails
  const handleResumeTimer = () => setIsPaused(false);

  return (
    <>
      <div className="timer">
        <i className="bi bi-clock-fill me-2"></i>
        Time Left:&nbsp;<span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
      </div>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          onPaymentComplete={onPaymentComplete}
          onPauseTimer={handlePauseTimer}
          onResumeTimer={handleResumeTimer}
        />
      </Elements>
    </>
  );
};

export default StripePayment;
