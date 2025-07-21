import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: `http://localhost:3000`,
    withCredentials: true 
    
})

const useAxiosSecure = () => {

    const {signOutUser}=useAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.response.use(
        res => res,
        error => {
            const status = error.response?.status;
            if (status === 403) {
                console.log('Status 403 from second line');
                navigate('/forbidden');
            } else if (status === 401) {
                logOut().then(() => navigate('/auth/login')).catch(console.error);
            }
            return Promise.reject(error);
        }
    );



    return axiosSecure;
};

export default useAxiosSecure;