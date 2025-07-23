import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { FaLock, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
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
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-md">
                    <MdError className="mx-auto text-5xl text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Data Missing</h2>
                    <p className="text-gray-600 mb-6">
                        No session data found. Please go back and try again.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Go Back
                    </button>
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
                                    <p class="font-semibold">Session: ${sessionData.campName}</p>
                                    <p><strong>Amount:</strong> ৳${amount}</p>
                                    <p><strong>Transaction ID:</strong> ${transactionId}</p>
                                    <p class="pt-2">Your payment has been successfully processed.</p>
                                </div>
                            `,
                            confirmButtonText: 'View My Bookings',
                            confirmButtonColor: '#22c55e',
                            allowOutsideClick: false,
                            customClass: {
                                popup: 'rounded-xl'
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
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
                    <p className="text-gray-600">Secure payment processed by Stripe</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Order Summary */}
                    <div className="bg-indigo-50 p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Camp Name:</span>
                                <span className="font-medium">{sessionData.campName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date & Time:</span>
                                <span className="font-medium">
                                    {new Date(sessionData.date).toLocaleDateString()} at {sessionData.time}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Venue:</span>
                                <span className="font-medium">{sessionData.venue}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="text-xl font-bold text-indigo-600">৳{amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaCreditCard className="mr-2 text-indigo-500" />
                            Payment Details
                        </h2>

                        <div className="mb-6">
                            <div className="border rounded-lg p-3 hover:border-indigo-400 transition">
                                <CardElement options={cardElementOptions} />
                            </div>
                            {error && (
                                <div className="mt-2 text-red-500 text-sm flex items-center">
                                    <MdError className="mr-1" /> {error}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center mb-6 text-sm text-gray-500">
                            <FaLock className="mr-2 text-indigo-500" />
                            Your payment is secured with 256-bit encryption
                        </div>

                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition flex items-center justify-center ${
                                !stripe || loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loading></Loading>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Pay ৳{amount}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Payment Methods */}
                    <div className="bg-gray-50 p-6 border-t">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">We accept</h3>
                        <div className="flex space-x-4">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-8" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" className="h-8" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple Pay" className="h-8" />
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google Pay" className="h-8" />
                        </div>
                    </div>
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center w-full"
                >
                    ← Back to previous page
                </button>
            </div>
        </div>
    );
};

export default PaymentForm;