
import React from "react";
import { Helmet } from "react-helmet";
import AdminLayout from "@/components/Layout/AdminLayout";
import AnalyticsDashboard from "@/components/Analytics/AnalyticsDashboard";

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | Food Delivery</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
