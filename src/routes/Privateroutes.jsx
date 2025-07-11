import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";


const PrivateRoutes = ({children}) => {

    const { user, loading } = useAuth();
    const location = useLocation();
    
    
   

    if (loading) {
        return <span className="loading loading-bars loading-xl"></span>
    }


    if(!user){
       return <Navigate state={{from: location.pathname}} to="/login"></Navigate>
    }



    return children;
};

export default PrivateRoutes;