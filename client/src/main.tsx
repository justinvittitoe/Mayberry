import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'
import Home from './pages/Home.js'
import SavedHomes from './pages/SavedHomes'
import CustomizeHome from './pages/CustomizeHome'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ProtectedRoute from './components/ProtectedRoute'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <ProtectedRoute><Home /></ProtectedRoute>
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
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
