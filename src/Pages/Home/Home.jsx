import React from 'react';
import AvailableStudySessions from '../AvailableStudySessions/AvailableStudySessions';
import Banner from './Banner';
import PopulerCourses from './FAQ';
import StudentTestimonials from './FAQ';
import WhyChooseUs from './FAQ';
import JoinCommunity from './FAQ';
import WhyChooseUsSection from './WhyChooseUsSection';
import FAQ from './FAQ';
import RecentSessions from './RecentSessions';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <AvailableStudySessions></AvailableStudySessions>
            <RecentSessions></RecentSessions>
            <WhyChooseUsSection></WhyChooseUsSection>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;