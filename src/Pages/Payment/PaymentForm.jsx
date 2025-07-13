import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const sessionData = location.state;

    const [error, setError] = useState('');

    if (!sessionData) {
        return (
            <div className="text-center mt-20 text-xl text-red-500 font-semibold">
                No session data found. Please go back and try again.
            </div>
        );
    }

    const amount = sessionData.registrationFee;
    const amountInCents = amount * 100;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        // Step 1: Create Payment Method
        const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (cardError) {
            setError(cardError.message);
            return;
        } else {
            setError('');
        }

        try {
            // Step 2: Create Payment Intent
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents
            });
            const clientSecret = res.data.clientSecret;

            // Step 3: Confirm Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    }
                }
            });

            if (result.error) {
                setError(result.error.message);
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                const transactionId = result.paymentIntent.id;

                try {
                    const bookingRes = await axiosSecure.post('/bookedSessions', sessionData);

                    if (bookingRes.data.insertedId) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            html: `
                <div class="text-left">
                  <p><strong>Transaction ID:</strong> ${transactionId}</p>
                  <p>Your payment has been successfully processed.</p>
                </div>
              `,
                            confirmButtonText: 'Go to My Booked Sessions',
                            confirmButtonColor: '#22c55e',
                            allowOutsideClick: false
                        }).then(result => {
                            if (result.isConfirmed) {
                                navigate('/dashboard/viewBookedSession');
                            }
                        });
                    }
                } catch (err) {
                    if (err.response?.status === 409) {
                        toast.error('You have already booked this session!');
                    } else {
                        toast.error('Something went wrong while booking.');
                        console.error(err);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            toast.error('Payment failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
            >
                <h2 className="text-xl font-semibold mb-4">Pay ৳{amount}</h2>

                <CardElement className="p-3 border rounded" />

                {error && <small className="text-red-500 mt-2 block">{error}</small>}

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition"
                    disabled={!stripe}
                >
                    Pay ৳{amount}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
