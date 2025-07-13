import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { useLocation } from 'react-router';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY)

const Payment = () => {
    const location = useLocation();
  const sessionData = location.state;

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm sessionData={sessionData}></PaymentForm>
        </Elements>
    );
};

export default Payment;