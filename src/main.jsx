import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Onboard from './components/Onboard.jsx'

const route = createBrowserRouter([{
  path: '/',
  element: <App/>,
  children: [
    {
      path:'/',
      element: <Onboard/>
    },
    {
      path:'/login',
      element: <Login/>
    },
    {
      path:'/home',
      element: <Home/>
    },
  ]

}])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={route}/>
)
