import { createBrowserRouter, Navigate } from "react-router-dom";

import { Exception } from "./exception";
import { Auth } from "./auth";



  export const routers = createBrowserRouter([{
    path: "/",
    element: <Navigate to={{ pathname: "/auth" }} />
  }, {
    path: "/auth/*",
    element: <Auth/>,

  },
  {
   path:'/*',
   element:<Exception/>
  }
  ])
