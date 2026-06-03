import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import App from './App.jsx'
import Home from './Components/Home/Home.jsx'
import Login from './Components/Login/Login.jsx'
import Layout from './Layout.jsx'
import Signup from './Components/Signup/Signup.jsx'

const router = createBrowserRouter([
  {
  path: '/',
  element: <Layout/>,
  children:[
  {
    path :"",
    element:<Home/>,
  },
  {
    path :"login",
    element:<Login/>
  },
  {
    path:"signup",
    element:<Signup/>
  },

  ]
}
  
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
