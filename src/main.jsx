import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './Router/router.jsx'
import AuthProvider from './Contexts/AuthProvider.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { RouterProvider } from "react-router";
// import { router } from './Router/router.jsx';
// import 'aos/dist/aos.css';
// import Aos from 'aos';
// import AuthProvider from './Contexts/AuthContexts/AuthProvider.jsx';
// import { ToastContainer } from 'react-toastify';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Aos.init();

// const queryClient = new QueryClient()

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <div className='font-urbanist max-w-7xl mx-auto'>
//       <QueryClientProvider client={queryClient}>
//         <AuthProvider>
// <RouterProvider router={router} />
//           <ToastContainer
//             position="top-center"
//             autoClose={3000}
//             hideProgressBar={true}
//             closeOnClick
//             pauseOnHover
//             draggable
//             theme="light"
//             toastClassName="!text-lg !text-center"
//           />
//         </AuthProvider>
//       </QueryClientProvider>
//     </div>
//   </StrictMode>,
// )