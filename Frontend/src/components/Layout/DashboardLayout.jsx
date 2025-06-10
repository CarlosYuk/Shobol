import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => (
  <div className="flex h-screen bg-stone-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        {children}
      </main>
    </div>
  </div>
);

export default DashboardLayout;
