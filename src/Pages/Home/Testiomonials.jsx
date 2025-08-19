// StudentTestimonials.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

const testimonials = [
    {
        id: 1,
        name: "Ethila",
        role: "Frontend Student",
        review: "The React course was amazing! The tutor explained everything so clearly that I finally understood hooks.",
        image: "https://i.postimg.cc/xjFPLwmp/SMSSLL.png",
        rating: 5,
        course: "Advanced React Course"
    },
    {
        id: 2,
        name: "Rakib Hossain",
        role: "Backend Learner",
        review: "I loved the Node.js sessions. The Study-Sphere team really helped me to understand API development step by step.",
        image: "https://i.postimg.cc/fW5cD65T/ssssdjdj.png",
        rating: 4,
        course: "Node.js Masterclass"
    },
    {
        id: 3,
        name: "Hales",
        role: "Fullstack Enthusiast",
        review: "This platform is the best place to start fullstack development. The tutors are friendly and always available.",
        image: "https://i.postimg.cc/RhPKdHqn/sjsjss.png",
        rating: 5,
        course: "Fullstack Development Bootcamp"
    },
    {
        id: 4,
        name: "Tanvir Alam",
        role: "Data Science Student",
        review: "The MongoDB workshop was outstanding. I can now design schemas and handle large datasets with confidence.",
        image: "https://i.postimg.cc/RhCwwRCB/jfjff.png",
        rating: 5,
        course: "Database Design Workshop"
    },
    {
        id: 5,
        name: "Alex",
        role: "UI/UX Learner",
        review: "The tutors gave detailed feedback on my projects. I learned how to design clean and user-friendly web apps.",
        image: "https://i.postimg.cc/mkF1Y5xK/SMSSS.png",
        rating: 4,
        course: "UI/UX Design Principles"
    },
    {
        id: 6,
        name: "Imran Kabir",
        role: "Cloud & DevOps Student",
        review: "Study-Sphere helped me prepare for my career in cloud computing. The hands-on projects were really helpful.",
        image: "https://i.postimg.cc/x87yYmYV/SMALLS.png",
        rating: 5,
        course: "Cloud Computing Certification"
    },

];

const Testimonials = () => {
    const renderStars = (rating) => {
        return (
            <div className="rating rating-sm">
                {[...Array(5)].map((_, i) => (
                    <input
                        key={i}
                        type="radio"
                        name={`rating-${Math.random()}`}
                        className={`mask mask-star-2 ${i < rating ? "bg-yellow-400" : "bg-gray-300"}`}
                        checked={i < rating}
                        readOnly
                    />
                ))}
            </div>
        );
    };


    return (
        <section className="py-16 bg-base-300 lg:px-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-primary mb-4">Student Voices</h2>
                    <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
                    <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
                        Hear from our learners about their transformative experiences
                    </p>
                </motion.div>

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {testimonials.map((t) => (
                        <SwiperSlide key={t.id}>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="h-full flex"
                            >
                                <div className="card flex-1 bg-accent/3 rounded-2xl shadow-sm hover:shadow-md border border-base-200 flex flex-col transition-all">
                                    <div className="card-body p-8 flex flex-col h-full">
                                        <div className="mb-6 flex justify-center">{renderStars(t.rating)}</div>

                                        <blockquote className="text-center italic text-base-content/90 mb-8 flex-1 relative">
                                            <span className="absolute -top-4 left-0 text-5xl text-primary opacity-10">“</span>
                                            {t.review}
                                            <span className="absolute -bottom-4 right-0 text-5xl text-primary opacity-10">”</span>
                                        </blockquote>

                                        <div className="flex flex-col items-center mt-auto">
                                            <div className="avatar mb-3">
                                                <div className="w-16 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                                                    <img src={t.image} alt={t.name} />
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-semibold">{t.name}</h3>
                                            <p className="text-sm text-base-content/70">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </SwiperSlide>

                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Testimonials;


