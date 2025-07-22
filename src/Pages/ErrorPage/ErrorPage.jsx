import React from 'react';
import Lottie from 'lottie-react';
import erro404page from '../../assets/error404.json';
import { Link } from 'react-router';

const ErrorPage = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white px-4">
      <Lottie 
        animationData={erro404page} 
        loop 
        autoplay 
        className="w-full max-w-3xl"
      />
            <Link to="/" className=" btn btn-primary bg-blue-700 text-white hover:bg-red-600 transition">
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;





