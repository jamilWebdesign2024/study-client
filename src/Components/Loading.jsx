import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../src/assets/loading.json'

const Loading = () => {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <Lottie animationData={loadingAnimation} loop autoplay style={{ width: 60 }} />
        </div>
    );
};

export default Loading;