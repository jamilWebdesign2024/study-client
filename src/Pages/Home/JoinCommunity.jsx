// components/JoinCommunity.jsx
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const JoinCommunity = () => {
  return (
    <section className="bg-black py-16 px-4 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
          আমাদের লাইভ ক্লাসগুলোতে অংশ নিতে এবং সবসময় আপডেটেড থাকতে,
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-12">
          যুক্ত হও আমাদের সাথে
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* YouTube */}
          <div className="flex items-center justify-between bg-gradient-to-r from-red-900 to-red-600 rounded-lg p-6">
            <div className="text-left">
              <h4 className="text-xl font-bold">আমাদের ফ্রি প্লে-লিস্ট</h4>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="btn mt-3 bg-red-500 hover:bg-red-600 text-white rounded-md btn-sm"
              >
                ভিডিও দেখুন
              </a>
            </div>
            <FaYoutube size={48} className="text-white drop-shadow-md" />
          </div>

          {/* Facebook Group */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-6">
            <div className="text-left">
              <h4 className="text-xl font-bold">অফিসিয়াল ফেসবুক গ্রুপ</h4>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="btn mt-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md btn-sm"
              >
                যুক্ত হন
              </a>
            </div>
            <FaFacebookF size={42} className="text-white drop-shadow-md" />
          </div>

          {/* Instagram */}
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-900 to-purple-700 rounded-lg p-6">
            <div className="text-left">
              <h4 className="text-xl font-bold">অফিসিয়াল ইন্সটাগ্রাম</h4>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="btn mt-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md btn-sm"
              >
                ফলো করুন
              </a>
            </div>
            <FaInstagram size={42} className="text-white drop-shadow-md" />
          </div>

          {/* Facebook Page */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg p-6">
            <div className="text-left">
              <h4 className="text-xl font-bold">অফিসিয়াল ফেসবুক পেজ</h4>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="btn mt-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md btn-sm"
              >
                যুক্ত হন
              </a>
            </div>
            <FaFacebookF size={42} className="text-white drop-shadow-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;
