import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./components/Main";
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);