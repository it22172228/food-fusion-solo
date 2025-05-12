
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, ShieldCheck, Building2, CreditCard, Bell, Gauge,
  Sun, Moon
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const adminLinks = [
  { name: "Dashboard", path: "/admin", icon: Gauge },
  { name: "Users & Restaurants", path: "/admin/users", icon: Users },
  { name: "Restaurant Approval", path: "/admin/restaurants", icon: Building2 },
  { name: "Finances", path: "/admin/finances", icon: CreditCard },
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <nav className="space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-800 dark:text-white">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
