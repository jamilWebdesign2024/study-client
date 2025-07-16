import {
  FaChalkboardTeacher,
  FaClock,
  FaCertificate,
  FaGraduationCap,
  FaLaptopCode,
  FaUserShield,
  FaHandsHelping,
  FaMobileAlt
} from 'react-icons/fa';

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: <FaChalkboardTeacher size={40} />,
      title: 'দক্ষ শিক্ষক',
      description: 'বিশেষায়িত শিক্ষক যারা সহজ করে বুঝান।',
      color: 'text-yellow-400',
      bg: 'bg-[#1c1c1c]'
    },
    {
      icon: <FaClock size={40} />,
      title: 'ফ্লেক্সিবল সময়',
      description: 'যেকোন সময়, যেকোন ডিভাইসে শিখুন।',
      color: 'text-blue-400',
      bg: 'bg-[#1c1c1c]'
    },
    {
      icon: <FaCertificate size={40} />,
      title: 'সার্টিফিকেট',
      description: 'প্রতিটি কোর্স শেষে সার্টিফিকেট পাবেন।',
      color: 'text-green-400',
      bg: 'bg-[#1c1c1c]'
    },
    {
      icon: <FaGraduationCap size={40} />,
      title: 'লাইফ-চেঞ্জিং কোর্স',
      description: 'শুধু শেখা না, ক্যারিয়ার গঠনের সুযোগ।',
      color: 'text-pink-400',
      bg: 'bg-[#1c1c1c]'
    },
    {
      icon: <FaLaptopCode size={40} />,
      title: 'প্র্যাকটিক্যাল প্রজেক্ট',
      description: 'হাতেকলমে শিখে রিয়েল লাইফ স্কিল তৈরি করুন।',
      color: 'text-purple-400',
      bg: 'bg-[#1c1c1c]'
    },
    {
      icon: <FaUserShield size={40} />,
      title: 'লাইফটাইম অ্যাক্সেস',
      description: 'একবার কিনলেই আজীবন শেখার সুযোগ।',
      color: 'text-red-400',
      bg: 'bg-[#1c1c1c]'
    },
    {
      icon: <FaHandsHelping size={40} />,
      title: 'ক্যারিয়ার সাপোর্ট',
      description: 'চাকরি খোঁজায় সাহায্য ও গাইডলাইন।',
      color: 'text-cyan-400',
      bg: 'bg-[#1c1c1c]'
    },
    {
      icon: <FaMobileAlt size={40} />,
      title: 'মোবাইল ফ্রেন্ডলি',
      description: 'মোবাইল থেকেও সহজে শিখুন যেকোন সময়।',
      color: 'text-orange-400',
      bg: 'bg-[#1c1c1c]'
    }
  ];

  return (
    <section className="bg-[#111111] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">কেন আমাদের কোর্স করবেন?</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`${feature.bg} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center`}
            >
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;