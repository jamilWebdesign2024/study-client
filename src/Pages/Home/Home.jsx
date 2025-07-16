import React from 'react';
import AvailableStudySessions from '../AvailableStudySessions/AvailableStudySessions';
import Banner from './Banner';
import PopulerCourses from './JoinCommunity';
import StudentTestimonials from './JoinCommunity';
import WhyChooseUs from './JoinCommunity';
import JoinCommunity from './JoinCommunity';
import WhyChooseUsSection from './WhyChooseUsSection';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <AvailableStudySessions></AvailableStudySessions>
            <WhyChooseUsSection></WhyChooseUsSection>
            <JoinCommunity></JoinCommunity>
        </div>
    );
};

export default Home;