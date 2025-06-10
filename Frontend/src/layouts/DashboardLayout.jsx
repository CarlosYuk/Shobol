import React from "react";

const DashboardLayout = ({ children }) => (
  <div className="flex h-screen">
    {/* Aquí puedes poner tu sidebar, header, etc */}
    <aside className="w-64 bg-gray-800 text-white">Sidebar</aside>
    <main className="flex-1 bg-gray-100 p-6">{children}</main>
  </div>
);

export default DashboardLayout;
