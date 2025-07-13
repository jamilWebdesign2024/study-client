import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import DashboardLayout from "../Layouts/DashboardLayout";
import CreateStudySession from "../Pages/Dashboard/CreateStudySession/CreateStudySession";
import ViewAllStudy from "../Pages/Dashboard/ViewAllStudy/ViewAllStudy";
import UploadMaterials from "../Pages/Dashboard/UploadMaterials/UploadMaterials";
import ViewAllMaterials from "../Pages/Dashboard/ViewAllMaterials/ViewAllMaterials";
import ViewBookedSession from "../Pages/Dashboard/StudentRoute/ViewBookedSession/ViewBookedSession";
import CreateNote from "../Pages/Dashboard/StudentRoute/CreateNote/CreateNote";
import ManagePersonalNotes from "../Pages/Dashboard/StudentRoute/ManagePersonalNotes/ManagePersonalNotes";
import ViewAllUsers from "../Pages/Dashboard/Admin/ViewAllUsers/ViewAllUsers";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import SignUp from "../Pages/Authentication/SignUp";
import PrivateRoutes from "../routes/Privateroutes";
import DashboardHome from "../Pages/Dashboard/DashBoardHome/DashboardHome";
import Forbidden from "../Pages/Dashboard/Forbidden/Forbidden";
import AdminRoutes from "../routes/AdminRoutes";
import ViewAllStudyAdmin from "../Pages/Dashboard/Admin/ViewAllStudyAdmin/ViewAllStudyAdmin";
import ViewDetails from "../Pages/ViewDetails/ViewDetails";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
        {
            index: true,
            Component: Home
        },
        {
            path: '/viewDetails/:id',
            Component: ViewDetails
        },
        {
            path: 'forbidden',
            Component: Forbidden
        }
    ]
  },
  {
        path: '/',
        Component: AuthLayout,
        children:[
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'signup',
                Component: SignUp
            }
        ]
  },



  {
      path: '/dashboard',
      element: <PrivateRoutes><DashboardLayout></DashboardLayout></PrivateRoutes>,
      children: [
          // tutor routes
            {
                index: true,
                Component: DashboardHome
            },
        
          {
              path: 'createStudySession',
              Component: CreateStudySession
          },
          {
              path: 'viewAllStudy',
              Component: ViewAllStudy
          },
          {
              path: 'uploadMaterials',
              Component: UploadMaterials
          },
          //  {/* all user are defined like tutor, student, admin */}
          {
              path: 'viewAllMaterials',
              Component: ViewAllMaterials
          },

          // student define 
          {
              path: 'viewBookedSession',
              Component: ViewBookedSession
          },
          {
              path: 'createNote',
              Component: CreateNote
          },
          {
              path: 'managePersonalNotes',
              Component: ManagePersonalNotes
          },


          //Admin only Routes
          {
              path: 'viewAllUsers',
              element: <AdminRoutes><ViewAllUsers></ViewAllUsers></AdminRoutes>
          },
          {
              path: 'viewAllStudyAdmin',
              element: <AdminRoutes><ViewAllStudyAdmin></ViewAllStudyAdmin></AdminRoutes>
          },

      ]
          
      
      
  }
]);