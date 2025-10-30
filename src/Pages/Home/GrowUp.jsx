import React from "react";
import Lottie from "lottie-react";
import EduAnimation from "../../../public/Online Learning.json";

const GrowUp = () => {
  return (
    <section className="py-12 px-4 sm:px-8 lg:px-16 bg-base-300">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        {/* Text Section */}
        <div className="text-center md:text-left md:w-1/2 space-y-4">
          <h2 className="jost text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            Grow up your skill with{" "}
            <span className="text-secondary">LearnPress LMS</span>
          </h2>
          <p className="text-base opacity-80 max-w-md mx-auto md:mx-0">
            <small>
              We denounce with righteous indignation and dislike men who are so
              beguiled and demoralized that they cannot trouble.
            </small>
          </p>
          <button className="btn btn-primary mt-4">Start Learning</button>
        </div>

        {/* Lottie Animation */}
        <div className="flex justify-center md:justify-end md:w-1/2">
          <Lottie
            animationData={EduAnimation}
            loop={true}
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[650px]"
          />
        </div>
      </div>
    </section>
  );
};

export default GrowUp;
