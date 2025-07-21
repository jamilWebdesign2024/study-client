import React from 'react';
// import Lottie from 'lottie-react';
// import loadingAnimation from '../../public/Loading.json'

const Loading = () => {
    return (
        <div className="min-h-screen flex justify-center items-center">
            {/* <Lottie animationData={loadingAnimation} loop autoplay style={{ width: 150 }} /> */}

            <span className="loading loading-spinner text-error"></span>
        </div>
    );
};

export default Loading;