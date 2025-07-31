import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.tsx'
import Home from './pages/Home.tsx'
import SavedHomes from './pages/SavedHomes'
import CustomizeHome from './pages/CustomizeHome'
import AdminDashboard from './pages/AdminDashboard'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ProtectedRoute from './components/ProtectedRoute'
import RoleBasedRoute from './components/RoleBasedRoute'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/login',
        element: <LoginForm />
      },
      {
        path: '/signup',
        element: <SignupForm />
      },
      {
        path: '/saved-homes',
        element: <ProtectedRoute><SavedHomes /></ProtectedRoute>
      },
      {
        path: '/customize/:planId',
        element: <ProtectedRoute><CustomizeHome /></ProtectedRoute>
      },
      {
        path: '/admin',
        element: <RoleBasedRoute allowedRoles={['admin']}><AdminDashboard /></RoleBasedRoute>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
