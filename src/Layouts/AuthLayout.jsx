import { Outlet } from "react-router";
import Navbar from "../Pages/shared/Navbar/Navbar";

const AuthLayout = () => {
    return (
        <div>
            <div>
                <Navbar></Navbar>
            </div>
            <div className="flex-col lg:flex-row-reverse">
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;