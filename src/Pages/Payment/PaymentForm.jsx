import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { FaLock, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import Loading from '../../Components/Loading';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const sessionData = location.state;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body text-center">
                        <MdError className="mx-auto text-5xl text-error mb-4" />
                        <h2 className="card-title justify-center text-2xl">Session Data Missing</h2>
                        <p className="text-base-content/70 mb-6">
                            No session data found. Please go back and try again.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-primary"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const amount = sessionData.registrationFee;
    const amountInCents = amount * 100;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create Payment Method
            const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card
            });

            if (cardError) {
                setError(cardError.message);
                setLoading(false);
                return;
            }

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
                        name: user.displayName || 'User',
                        email: user.email
                    }
                }
            });

            if (result.error) {
                setError(result.error.message);
                setLoading(false);
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
                                <div class="text-left space-y-2">
                                    <p class="font-semibold">Session: ${sessionData.sessionTitle}</p>
                                    <p><strong>Amount:</strong> ৳${amount}</p>
                                    <p><strong>Transaction ID:</strong> ${transactionId}</p>
                                    <p class="pt-2">Your payment has been successfully processed.</p>
                                </div>
                            `,
                            confirmButtonText: 'View My Bookings',
                            confirmButtonColor: '#22c55e',
                            allowOutsideClick: false,
                            customClass: {
                                popup: 'rounded-box'
                            }
                        }).then(result => {
                            if (result.isConfirmed) {
                                navigate('/dashboard/viewBookedSession');
                            }
                        });
                    }
                } catch (err) {
                    setLoading(false);
                    if (err.response?.status === 409) {
                        toast.error('You have already booked this session!');
                    } else {
                        toast.error('Something went wrong while booking.');
                        console.error(err);
                    }
                }
            }
        } catch (err) {
            setLoading(false);
            console.error(err);
            toast.error('Payment failed. Please try again.');
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: 'var(--fallback-bc,oklch(var(--bc)/1))',
                '::placeholder': {
                    color: 'oklch(var(--bc)/0.4)',
                },
                backgroundColor: 'oklch(var(--b1)/1)',
            },
            invalid: {
                color: 'oklch(var(--er)/1)',
            },
        },
        hidePostalCode: true
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
                    <p className="text-base-content/70">Secure payment processed by Stripe</p>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    {/* Order Summary */}
                    <div className="bg-primary/10 p-6">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-base-content/70">Session:</span>
                                <span className="font-medium">{sessionData.sessionTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-base-content/70">Tutor:</span>
                                <span className="font-medium">{sessionData.tutorName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-base-content/70">Duration:</span>
                                <span className="font-medium">{sessionData.sessionDuration} weeks</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-base-300">
                                <span className="text-base-content/70">Total Amount:</span>
                                <span className="text-xl font-bold text-primary">৳{amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="card-body">
                        <h2 className="card-title mb-4">
                            <FaCreditCard className="text-primary" />
                            Payment Details
                        </h2>

                        <div className="form-control mb-4">
                            <div className="border border-base-300 rounded-box p-3 hover:border-primary transition">
                                <CardElement options={cardElementOptions} />
                            </div>
                            {error && (
                                <div className="mt-2 text-error text-sm flex items-center">
                                    <MdError className="mr-1" /> {error}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center mb-6 text-sm text-base-content/70">
                            <FaLock className="mr-2 text-primary" />
                            Your payment is secured with 256-bit encryption
                        </div>

                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className="btn btn-primary btn-lg w-full"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>Pay ৳{amount}</>
                            )}
                        </button>
                    </form>

                    {/* Payment Methods */}
                    <div className="bg-base-200 p-6">
                        <h3 className="text-sm font-medium text-base-content/70 mb-3">We accept</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-base-100 p-2 rounded-box">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-6" />
                            </div>
                            <div className="bg-base-100 p-2 rounded-box">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" className="h-6" />
                            </div>
                            <div className="bg-base-100 p-2 rounded-box">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple Pay" className="h-6" />
                            </div>
                            <div className="bg-base-100 p-2 rounded-box">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google Pay" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost mt-6 w-full"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to previous page
                </button>
            </div>
        </div>
    );
};

export default PaymentForm;