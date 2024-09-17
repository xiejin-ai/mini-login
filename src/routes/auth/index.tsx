import {  Navigate, useRoutes } from "react-router-dom"
import { Login } from "./login";
import { Exception } from "../exception"
import { Register } from "./register";

export const Auth =()=>{

  const routes = useRoutes([{
    path: '/',
    element: <Navigate to={'/auth/login'} replace/>
  },{
    path: 'login',
    element: <Login/>
  },{
    path: 'register',
    element: <Register />
  },{
    path:'/*',
    element:<Exception/>
   }]
  )
 return routes

}