import React from "react";
import UserStatsChart from "../components/Userchart";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <UserStatsChart />
    </>
  );
};

export default AdminDashboard;
