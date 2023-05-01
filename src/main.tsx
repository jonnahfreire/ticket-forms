import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ClientForm } from "./pages/ClientForm";
import { Form } from "./pages/Form";

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

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route path="/ticket-forms" element={<Form/>}></Route>
          <Route path="/ticket-forms/client/:id" element={<ClientForm/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <Router />
  </React.StrictMode>
);
