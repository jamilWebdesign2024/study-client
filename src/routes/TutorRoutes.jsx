import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import Loading from '../Components/Loading';
import { Navigate } from 'react-router';

const TutorRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();

    


    if (loading || roleLoading) {
        return <Loading></Loading>
    }

    if (!user || role !== 'tutor') {
        return <Navigate state={{ from: location.pathname }} to='/forbidden'></Navigate>
    }

    return children;
};

export default TutorRoutes;