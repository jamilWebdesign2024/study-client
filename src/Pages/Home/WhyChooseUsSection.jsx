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
      icon: <FaChalkboardTeacher size={28} />,
      title: 'Skilled Instructors',
      description: 'Industry-expert mentors who make learning simple and practical.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: <FaClock size={28} />,
      title: 'Flexible Timing',
      description: 'Learn anytime, from any device, at your own pace.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <FaCertificate size={28} />,
      title: 'Certification',
      description: 'Get certified after completing every course successfully.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <FaGraduationCap size={28} />,
      title: 'Career-Focused Courses',
      description: 'Not just learning — build a real-world career path.',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: <FaLaptopCode size={28} />,
      title: 'Hands-On Projects',
      description: 'Gain real-life experience by building practical projects.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <FaUserShield size={28} />,
      title: 'Lifetime Access',
      description: 'Pay once, and get lifetime access to all your courses.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: <FaHandsHelping size={28} />,
      title: 'Career Support',
      description: 'Receive job placement help, resume reviews, and guidance.',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      icon: <FaMobileAlt size={28} />,
      title: 'Mobile Friendly',
      description: 'Learn seamlessly even from your mobile devices.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <section className="bg-gray-300 text-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Why Choose Our Courses?
          </h2>
          <p className="text-grey-600 mt-2 text-base md:text-lg">
            Empowering learners with real-world skills, flexible schedules, and expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className={`w-12 h-12 mx-auto flex items-center justify-center rounded-full mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 text-center">{feature.title}</h3>
              <p className="text-sm text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
