import React from 'react';
import useUserRole from '../../../hooks/useUserRole';
import StudentDashboard from './StudentDashboard';
import TutorDashboard from './TutorDashboard';
import AdminDashboard from './AdminDashboard';
import Forbidden from '../Forbidden/Forbidden';


const DashboardHome = () => {

    const { role, roleLoading } = useUserRole()
    if (roleLoading) {
        return <div>
            <p>Loading..</p>
        </div>
    }

    if (role === 'student') {
        return <StudentDashboard></StudentDashboard>
    } else if (role === 'tutor') {
        return <TutorDashboard></TutorDashboard>
    } else if (role === 'admin') {
        return <AdminDashboard></AdminDashboard>
    }

    return <Forbidden></Forbidden>
};

export default DashboardHome;