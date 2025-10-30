import React from "react";
import { Link } from "react-router";

const Learn = () => {
  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-12 bg-base-300">
      <div className="bg-gradient-to-r from-primary/50 to-accent/20 rounded-2xl flex flex-col md:flex-row items-center justify-between overflow-hidden">
        
        {/* === Left Text Section === */}
        <div className="space-y-3 py-8 px-6 sm:px-10 md:w-1/2 text-center md:text-left">
          <p className="text-sm font-semibold text-primary/90">
            GET MORE POWER FROM
          </p>
          <h2 className="jost text-3xl sm:text-4xl md:text-4xl font-bold text-primary">
            LearnPress StudySphere
          </h2>
          <p className="text-base opacity-80 max-w-md mx-auto md:mx-0">
            <small>
              The next level of LearnPress - LMS WordPress Plugin. More
              Powerful, Flexible and Magical Inside.
            </small>
          </p>
          <Link
            to="/all-study-sessions"
            className="btn btn-primary rounded-full shadow-lg mt-3"
          >
            Explore Sessions
          </Link>
        </div>

        {/* === Right Image Section === */}
        <div className="md:w-1/2 flex flex-wrap justify-center md:justify-end gap-4 p-6">
          
          {/* Column 1 */}
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/Vector (1).png"
              alt="Learn"
              className="rounded-2xl w-20 sm:w-24 bg-blue-900 p-4 shadow-lg -rotate-6"
            />
            <img
              src="/Stripe Logo.png"
              alt="Stripe"
              className="rounded-2xl w-20 sm:w-24 bg-yellow-400 p-4 shadow-lg rotate-6"
            />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/Vector (4).png"
              alt="Learn"
              className="rounded-2xl w-20 sm:w-24 bg-green-500 p-4 shadow-lg rotate-6"
            />
            <img
              src="/Vector (5).png"
              alt="Learn"
              className="rounded-2xl w-20 sm:w-24 bg-purple-600 p-4 shadow-lg -rotate-6"
            />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/Vector (2).png"
              alt="Learn"
              className="rounded-2xl w-20 sm:w-24 bg-blue-500 p-4 shadow-lg -rotate-6"
            />
            <img
              src="/Vector (3).png"
              alt="Learn"
              className="rounded-2xl w-16 sm:w-20 bg-amber-500/80 p-4 shadow-lg rotate-6"
            />
          </div>

          {/* Column 4 */}
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/Vector (6).png"
              alt="Learn"
              className="rounded-2xl w-20 sm:w-24 bg-red-700 p-4 shadow-lg -rotate-6"
            />
            <img
              src="/21.png"
              alt="Learn"
              className="rounded-2xl w-20 sm:w-24 bg-purple-700 p-4 shadow-lg rotate-6"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Learn;
