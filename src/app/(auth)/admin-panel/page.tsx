"use client";
import { useSidebar } from "@/context/Sidebar";

function Admin() {
  const { sidebarOpen } = useSidebar();

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Admin panel</h1>
      </div>
    </>
  );
}

export default Admin;
