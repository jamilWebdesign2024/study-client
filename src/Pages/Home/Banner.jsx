import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Banner = () => {
    // CSS Variables
    const bannerStyles = {
        swiperContainer: 'w-full h-screen max-h-[800px] relative',
        slideContainer: 'w-full h-full relative',
        imageWrapper: 'absolute inset-0 w-full h-full overflow-hidden',
        image: 'w-full h-full object-cover object-center',
        overlay: 'absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent',
        contentWrapper: 'absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 pt-16 md:pt-24',
        heading: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-2',
        title: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6',
        button: 'px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105'
    };

    // Banner data
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
            heading: 'Elevate Your Learning',
            title: 'Join Our Interactive Study Sessions',
            buttonText: 'Explore Courses',
            buttonLink: '/courses'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
            heading: 'Expert Tutors',
            title: 'Learn From Industry Professionals',
            buttonText: 'Find Tutors',
            buttonLink: '/tutors'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
            heading: 'Study Materials',
            title: 'Access Premium Learning Resources',
            buttonText: 'Browse Materials',
            buttonLink: '/materials'
        }
    ];

    return (
        <div className={bannerStyles.swiperContainer}>
            <style jsx>{`
                .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    margin: 0 8px !important;
                    background: white;
                    opacity: 0.6;
                }
                .swiper-pagination-bullet-active {
                    background: #F59E0B;
                    opacity: 1;
                    width: 30px;
                    border-radius: 5px;
                }
                .swiper-button-next, 
                .swiper-button-prev {
                    color: white;
                    background: rgba(0,0,0,0.3);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    transition: all 0.3s;
                }
                .swiper-button-next:hover, 
                .swiper-button-prev:hover {
                    background: rgba(0,0,0,0.5);
                }
                .swiper-button-next::after, 
                .swiper-button-prev::after {
                    font-size: 1.2rem;
                }
                @keyframes fadeInUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(30px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 1s ease-out forwards;
                }
            `}</style>

            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className={bannerStyles.slideContainer}>
                            {/* Background Image */}
                            <div className={bannerStyles.imageWrapper}>
                                <img 
                                    src={slide.image} 
                                    alt={slide.title}
                                    className={bannerStyles.image}
                                    loading="eager"
                                />
                                <div className={bannerStyles.overlay}></div>
                            </div>
                            
                            {/* Content */}
                            <div className={bannerStyles.contentWrapper}>
                                <h3 
                                    className={`${bannerStyles.heading} animate-fadeInUp`}
                                    style={{animationDelay: '0.2s'}}>
                                    {slide.heading}
                                </h3>
                                <h2 
                                    className={`${bannerStyles.title} animate-fadeInUp`}
                                    style={{animationDelay: '0.4s'}}
                                >
                                    {slide.title}
                                </h2>
                                <button 
                                    className={`${bannerStyles.button} animate-fadeInUp bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 'hover:bg-blue-50`}
                                    style={{animationDelay: '0.6s'}}
                                    onClick={() => window.location.href = slide.buttonLink}
                                >
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                
                Navigation Arrows
                {/* <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div> */}
            </Swiper>
        </div>
    );
};

export default Banner;