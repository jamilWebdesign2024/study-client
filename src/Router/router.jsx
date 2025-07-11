import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import DashboardLayout from "../Layouts/DashboardLayout";
import CreateStudySession from "../Pages/Dashboard/CreateStudySession/CreateStudySession";
import ViewAllStudy from "../Pages/Dashboard/ViewAllStudy/ViewAllStudy";
// // import PrivateRoutes from "../routes/Privateroutes";
// import DashboardLayout from "../Layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
        {
            index: true,
            Component: Home
        }
    ]
  },
  {
      path: '/dashboard',
      element: <DashboardLayout></DashboardLayout>,
      children: [
          {
              path: 'createStudySession',
              Component: CreateStudySession
          },
          {
              path: 'viewAllStudy',
              Component: ViewAllStudy
          },

      ]
          
      
      
  }
]);