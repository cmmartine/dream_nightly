import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ContextProviderWrapper from "./components/context/ContextProviderWrapper";
import Main from "./components";
import ContactPage from "./components/InfoPages/ContactPage";
import PrivacyPage from "./components/InfoPages/PrivacyPage";
import NotFound from "./components/InfoPages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />
    },
    {
        path: "/contact",
        element: <ContactPage/>
    },
    {
        path: "/privacy",
        element: <PrivacyPage/>
    },
    {
        path: "*",
        element: <NotFound />
    },
]);

createRoot(document.getElementById('root')).render(
    <ContextProviderWrapper>
        <RouterProvider router={router} />
    </ContextProviderWrapper>
);