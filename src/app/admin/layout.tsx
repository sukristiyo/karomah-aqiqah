import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F4F7F6] font-sans overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F4F7F6]">
          {/* Main content container with white background and subtle shadow for the specific pages, wait, let's keep the bg transparent here and let pages define their cards, OR wrap children in a card? The reference dashboard has "Dashboard Overview" and then multiple cards. Our pages currently have a title and a form. Let's let the pages handle their own titles and cards. So we just render children here. Wait, earlier we had a white background wrapper. Let's just render children so the pages can look like the screenshot (title, then cards). But wait, our pages currently just have the form. Let's just wrap children in nothing and let the pages render their own cards, OR wrap them here. Actually, I will wrap them in a nice card here for simplicity, OR modify the pages. Our pages already render `h1`. But `AdminHeader` now has the `h1` page title. */}
          {/* Let's render children directly. */}
          {children}
        </main>
      </div>
    </div>
  );
}
