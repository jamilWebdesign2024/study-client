import React from 'react';
import AvailableStudySessions from '../AvailableStudySessions/AvailableStudySessions';
import Banner from './Banner';
import PopulerCourses from './FAQ';
import StudentTestimonials from './FAQ';
import WhyChooseUs from './FAQ';
import JoinCommunity from './FAQ';
import WhyChooseUsSection from './WhyChooseUsSection';
import FAQ from './FAQ';
// import UpcomingSessions from './UpcomingSessions';
import Testimonials from './Testiomonials';
import Newsletter from './NewsLetter';
import Categories from './Categories';
import Learn from './Learn';
import GrowUp from './GrowUp';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Categories />
            <AvailableStudySessions></AvailableStudySessions>
            <Learn></Learn>
            {/* <UpcomingSessions></UpcomingSessions> */}
            <Testimonials></Testimonials>
            <GrowUp></GrowUp>
            <WhyChooseUsSection></WhyChooseUsSection>
            <FAQ></FAQ>
            <Newsletter></Newsletter>
        </div>
    );
};

export default Home;