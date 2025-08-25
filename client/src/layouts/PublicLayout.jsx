import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const PublicLayout = () => (
    <>
        <Header />
        <Outlet />
    </>
);

export default PublicLayout;