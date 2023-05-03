import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  HashRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  useParams,
  createHashRouter,
} from "react-router-dom";
import App from "./App";
import "./index.css";

import { ClientForm } from "./pages/ClientForm";
import { Form } from "./pages/Form";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/form",
        element: <Form />,
      },
      {
        path: "/form/:id",
        element: <ClientForm />,
      },
    ],
  },
]);

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Form />}></Route>
          <Route path="/:id" element={<ClientForm />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <Router /> */}
  </React.StrictMode>
);
