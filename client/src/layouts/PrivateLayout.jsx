import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { Outlet } from "react-router-dom";

const PrivateLayout = () => (
    <>
        <DashboardNavbar />
        <Outlet />
    </>
);

export default PrivateLayout;