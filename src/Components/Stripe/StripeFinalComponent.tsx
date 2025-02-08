import { loadStripe, Stripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react'
import StripePayment from './StripePayment';
import apiRequest from '../../Utils/apiRequest';

const StripeFinalComponent = () => {
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [clientSecret, setClientSecret] = useState<string>("");

    useEffect(() => {
        apiRequest<{ publishableKey: string }>({ method: "get", url: "/config" })
            .then((r) => {
                console.log(r.publishableKey, "dfvvdcxx");
                setStripePromise(loadStripe(r.publishableKey));
            })
            .catch((error) => {
                console.error("Error loading Stripe.js library:", error);
                setStripePromise(null);
            });
    }, []);

    useEffect(() => {
        apiRequest({
            method: "post",
            url: "/create-payment-intent",
            data: {}
        })
            .then((result: any) => {
                console.log(result.clientSecret, "Client Secret fetched");
                setClientSecret(result.clientSecret || "");
            })
            .catch((error) => {
                console.error("Error fetching client secret:", error);
                setClientSecret('');
            });
    }, []);


    return (
        <>
            {/* {stripePromise && clientSecret && <StripePayment stripePromise={stripePromise} clientSecret={clientSecret} />} */}
        </>
    )
}

export default StripeFinalComponent