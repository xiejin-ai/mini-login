import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import {  routers } from './routes/root'
import {  RouterProvider } from 'react-router-dom';
import './mock';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <RouterProvider router={routers} ></RouterProvider>
  </StrictMode>,
)
