import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";

const Banner = () => {
    const slides = [
        {
            id: 1,
            image: "https://i.postimg.cc/HxYqvBmG/360-F-631479392-ZIDxz-FDUo-BYg8Vch-TRJ7Tj-QWlm-D0J920.jpg",
            heading: "Empower Your Learning Journey",
            title: "Achieve academic excellence with flexible and interactive online courses tailored for you.",
            buttonText: "Browse Sessions",
            buttonLink: "/all-study-sessions",
        },
        {
            id: 2,
            image: "https://png.pngtree.com/background/20210709/original/pngtree-cartoon-education-training-cram-school-picture-image_917042.jpg",
            heading: "Learn From Certified Instructors",
            title: "Gain real-world skills and guidance from top educators and industry professionals.",
            buttonText: "Browse Sessions",
            buttonLink: "/all-study-sessions",
        },
        {
            id: 3,
            image: "https://i.postimg.cc/0N0gChTs/pngtree-cartoon-education-training-cram-school-picture-image-917042.png",
            heading: "Upgrade Your Study Resources",
            title: "Access premium materials and tools that boost confidence and strengthen knowledge.",
            buttonText: "Browse Sessions",
            buttonLink: "/all-study-sessions",
        },
    ];

    return (
        <div className="w-full h-[90vh] md:h-screen relative overflow-hidden">
            <Swiper
                loop={true}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                modules={[Autoplay, Pagination]}
                className="h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">

                            {/* ✅ Dimmed Image */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover brightness-75"
                            />

                            {/* ✅ Strong Overlay to protect text visibility */}
                            <div className="absolute inset-0 bg-black/50 bg-opacity-60"></div>

                            {/* ✅ Clean Text Area */}
                            <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-20 gap-5 z-10 max-w-lg">

                                <h2 className="jost text-3xl sm:text-4xl md:text-4xl font-bold text-white drop-shadow-lg">
                                    {slide.heading}
                                </h2>

                                <p className="text-base text-gray-100/60 leading-relaxed drop-shadow font-normal jost">
                                    {slide.title}
                                </p>

                                <Link
                                    to={slide.buttonLink}
                                    className="btn btn-primary rounded-full shadow-lg"
                                >
                                    {slide.buttonText}
                                </Link>
                            </div>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;
