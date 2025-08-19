import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            toast.success("✅ Subscribed Successfully!");
            setEmail(""); // input clear করে দিবে
        } else {
            toast.error("❌ Please enter a valid email!");
        }
    };

    return (
        <section className="w-full py-16 px-4 md:px-10 lg:px-20 bg-base-300">
            <motion.div
                className="max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content">
                    Subscribe to Our Newsletter
                </h2>
                <p className="text-base md:text-lg text-base-content/70 mb-8">
                    Stay updated with upcoming study sessions, events, and exclusive learning resources.
                </p>

                {/* Form */}
                <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input input-bordered w-full md:w-2/3"
                        required
                    />
                    <button type="submit" className="btn btn-primary w-full md:w-auto">
                        Subscribe
                    </button>
                </form>

                {/* Small Note */}
                <p className="text-sm mt-6 text-base-content/60">
                    We respect your privacy. Unsubscribe anytime.
                </p>
            </motion.div>
        </section>
    );
};

export default Newsletter;
