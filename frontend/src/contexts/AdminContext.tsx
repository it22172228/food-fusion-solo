
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNotification } from "./NotificationContext";

// Define types
type AdminContextType = {
  approveRestaurant: (id: string) => void;
  rejectRestaurant: (id: string) => void;
  suspendAccount: (id: string, type: "restaurant" | "user" | "driver") => void;
  activateAccount: (id: string, type: "restaurant" | "user" | "driver") => void;
  resolveComplaint: (id: string) => void;
  processRefund: (orderId: string, amount: number) => void;
  updateNotificationTemplate: (type: string, template: string) => void;
  notificationTemplates: Record<string, string>;
};

// Mock notification templates
const defaultTemplates = {
  newOrder: "Your order #{{orderId}} has been placed successfully!",
  orderDelivered: "Your order #{{orderId}} has been delivered!",
  accountSuspended: "Your account has been suspended. Please contact support.",
  restaurantApproved: "Your restaurant has been approved and is now visible to customers.",
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { showNotification } = useNotification();
  const [notificationTemplates, setNotificationTemplates] = useState<Record<string, string>>(defaultTemplates);

  // Restaurant management
  const approveRestaurant = (id: string) => {
    // In a real app, this would call an API
    console.log(`Restaurant ${id} approved`);
    showNotification(`Restaurant ${id} has been approved`, "success");
  };

  const rejectRestaurant = (id: string) => {
    console.log(`Restaurant ${id} rejected`);
    showNotification(`Restaurant ${id} has been rejected`, "error");
  };

  // Account management
  const suspendAccount = (id: string, type: "restaurant" | "user" | "driver") => {
    console.log(`${type} account ${id} suspended`);
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} account ${id} has been suspended`, "warning");
  };

  const activateAccount = (id: string, type: "restaurant" | "user" | "driver") => {
    console.log(`${type} account ${id} activated`);
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} account ${id} has been activated`, "success");
  };

  // Complaints
  const resolveComplaint = (id: string) => {
    console.log(`Complaint ${id} resolved`);
    showNotification(`Complaint ${id} has been resolved`, "success");
  };

  // Financial transactions
  const processRefund = (orderId: string, amount: number) => {
    console.log(`Refund of $${amount} processed for order ${orderId}`);
    showNotification(`Refund of $${amount} processed for order ${orderId}`, "info");
  };

  // Notification templates
  const updateNotificationTemplate = (type: string, template: string) => {
    setNotificationTemplates(prev => ({
      ...prev,
      [type]: template,
    }));
    showNotification(`Notification template updated`, "success");
  };

  return (
    <AdminContext.Provider
      value={{
        approveRestaurant,
        rejectRestaurant,
        suspendAccount,
        activateAccount,
        resolveComplaint,
        processRefund,
        updateNotificationTemplate,
        notificationTemplates,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
