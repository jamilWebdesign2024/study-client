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
            image: "https://i.postimg.cc/9M9JYwSB/book-bg-85aaf0c1dd945315.jpg",
            heading: "Elevate Your Learning",
            title: "Join Our Interactive Study Sessions",
            buttonText: "Explore Courses",
            buttonLink: "/courses",
        },
        {
            id: 2,
            image:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
            heading: "Expert Tutors",
            title: "Learn From Industry Professionals",
            buttonText: "Find Tutors",
            buttonLink: "/tutors",
        },
        {
            id: 3,
            image:
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            heading: "Study Materials",
            title: "Access Premium Learning Resources",
            buttonText: "Browse Materials",
            buttonLink: "/materials",
        },
    ];

    return (
        <div className="w-full h-screen max-h-[800px] relative">
            <Swiper
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                modules={[Autoplay, Pagination]}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            {/* Background Image with fixed ratio */}
                            <div className="absolute inset-0 w-full h-full aspect-[16/9]">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/50"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
                                <h3 className="text-lg sm:text-xl md:text-2xl text-secondary mb-2 font-medium animate-fadeInUp">
                                    {slide.heading}
                                </h3>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-content mb-6 animate-fadeInUp">
                                    {slide.title}
                                </h2>
                                <Link
                                    to={slide.buttonLink}
                                    className="btn btn-primary btn-wide animate-fadeInUp"
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
