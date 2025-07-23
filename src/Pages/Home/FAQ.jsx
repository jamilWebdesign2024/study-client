import { motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    question: "What is StudySphere?",
    answer:
      "StudySphere is an online learning platform where students can book live study sessions, manage their notes, and get help from qualified tutors.",
  },
  {
    question: "How can I book a session?",
    answer:
      "Simply browse the available sessions and click on the 'Enroll Now' button to book your preferred session.",
  },
  {
    question: "How do I join as a tutor on StudySphere?",
    answer:
      "Log in to your account and click on the 'Become a Tutor' option to apply. Our team will review your application.",
  },
  {
    question: "Where can I access the materials or recordings of a session?",
    answer:
      "Go to your dashboard, click on your enrolled sessions, and you’ll find the available study materials there.",
  },
  {
    question: "Is StudySphere free?",
    answer:
      "Many sessions on StudySphere are free, but some premium content may require a fee.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="py-16 px-4 text-black w-11/12 mx-auto">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-primary)]">
          Frequently Asked Questions
        </h2>
        <p className="mb-10 text-gray-600">
          Below are some of the most common questions asked by StudySphere users.
        </p>

        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-300 rounded-lg p-5 cursor-pointer bg-white shadow-sm"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">{faq.question}</h4>
                <span className="text-xl font-bold">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-gray-700"
                >
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
