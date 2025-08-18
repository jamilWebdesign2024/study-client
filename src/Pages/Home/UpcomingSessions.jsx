// UpcomingSessions.jsx
import { motion } from "framer-motion";

const sessionsData = [
  {
    id: 1,
    category: "Software",
    title: "Frontend Bootcamp",
    advisor: "Alex Johnson",
    price: 7000,
    students: 2300,
    image: "https://i.postimg.cc/HW6xV3b2/team-working-animation-project.jpg",
  },
  {
    id: 2,
    category: "Software",
    title: "Node & API Engineering",
    advisor: "Michael Smith",
    price: 5500,
    students: 2100,
    image: "https://i.postimg.cc/yNKBfSFx/7090057.jpg",
  },

  // Education (2)
  {
    id: 3,
    category: "Education",
    title: "Neoclear Science Fundamentals",
    advisor: "Sophia Lee",
    price: 15000,
    students: 1800,
    image: "https://i.postimg.cc/0N1mcZWS/girl-female-teacher-doing-science-experiments-with-test-tubes-microscope.jpg",
  },
  {
    id: 4,
    category: "Education",
    title: "Einstein’s Theory of Relativity",
    advisor: "Emma Davis",
    price: 6000,
    students: 1650,
    image: "https://i.postimg.cc/kXn7FSv5/li31-2cqy-211224.jpg",
  },

  // Religious (2)
  {
    id: 5,
    category: "Religious",
    title: "Quranic Science & Modern Discoveries",
    advisor: "Daniel Brown",
    price: 8500,
    students: 2000,
    image: "https://i.postimg.cc/C5nkctgj/pirate-artifacts-arrangement-still-life.jpg",
  },
  {
    id: 6,
    category: "Religious",
    title: "Quranic Arabic Basics",
    advisor: "Olivia Wilson",
    price: 5000,
    students: 1750,
    image: "https://i.postimg.cc/QNKf4YS4/koran-holy-book-muslims.jpg",
  },
];

const UpcomingSessions = () => {
  return (
    <section className="py-12 px-4 lg:px-16 bg-base-300">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-primary"
        >
          Upcoming Sessions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-3 text-base-content"
        >
          Explore our expert-led training programs.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sessionsData.map((session, idx) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="card bg-accent/4 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            <figure>
              <img
                src={session.image}
                alt={session.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <div className="badge badge-primary w-fit">{session.category}</div>
              <h3 className="card-title text-lg font-semibold mt-2">
                {session.title}
              </h3>
              <p className="text-sm text-base-content/70">
                Advisor <span className="text-primary font-medium">{session.advisor}</span>
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-base-content/80">Student: {session.students}</span>
                <span className="text-primary font-semibold">${session.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingSessions;
