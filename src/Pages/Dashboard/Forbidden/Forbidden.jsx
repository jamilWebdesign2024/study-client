import { Link } from 'react-router';
import { FaBan } from 'react-icons/fa';
import forbidden1 from '../../../assets/forbidden403.json'
import Lottie from 'lottie-react';

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center px-4">
           
            <Lottie
                animationData={forbidden1}
                loop
                autoplay
                className="w-full max-w-xl"
            />
            <p className="text-gray-600 mb-6">
                You don't have permission to access this page.
            </p>
            <Link to="/" className="btn btn-primary bg-blue-700 text-white">
                Go Back Home
            </Link>
        </div>
    );
};

export default Forbidden;