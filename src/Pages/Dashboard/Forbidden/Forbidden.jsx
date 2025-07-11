import { Link } from 'react-router';
import { FaBan } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center px-4">
            <FaBan className="text-red-500 text-6xl mb-4" />
            <h1 className="text-4xl font-bold text-error mb-2">403 - Forbidden</h1>
            <p className="text-gray-600 mb-6">
                You don't have permission to access this page.
            </p>
            <Link to="/" className="btn btn-primary text-black">
                Go Back Home
            </Link>
        </div>
    );
};

export default Forbidden;