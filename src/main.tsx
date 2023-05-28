import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./index.css";

import { ClientForm } from "./pages/ClientForm";
import { Form } from "./pages/Form";
import { Login } from "./pages/Login";
import { Tickets } from "./pages/Tickets";
import { routes } from "./constants";
import { TicketDetails } from "./pages/TicketDetails";

const router = createBrowserRouter([
  {
    path: routes.root,
    element: <App />,
    children: [
      {
        path: routes.root,
        element: <Login />,
      },
      {
        path: routes.form,
        element: <Form />,
      },
      {
        path: routes.tickets,
        element: <Tickets />,
      },
      {
        path: routes.client,
        element: <ClientForm />,
      },
      {
        path: routes.ticketDetails,
        element: <TicketDetails />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
