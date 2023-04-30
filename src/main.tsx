import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import './index.css'

import { ClientForm } from "./pages/ClientForm";
import { Form } from './pages/Form';

const router = createBrowserRouter([
  {
    path: "/ticket-forms",
    element: <App />,
    children: [
      {
        path: "/ticket-forms/",
        element: <Form />,
      },
      {
        path: "/ticket-forms/client/:id",
        element: <ClientForm />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
