
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import HomePage from "@/pages/HomePage";
import RestaurantsPage from "@/pages/RestaurantsPage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import CartPage from "@/pages/CartPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import OrdersPage from "@/pages/OrdersPage";
import NotificationsTestPage from "@/pages/NotificationsTestPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminRestaurantsPage from "@/pages/admin/AdminRestaurantsPage";
import AdminFinancesPage from "@/pages/admin/AdminFinancesPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <AdminProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                    <Route path="/restaurants" element={<MainLayout><RestaurantsPage /></MainLayout>} />
                    <Route path="/restaurants/:id" element={<MainLayout><RestaurantDetailPage /></MainLayout>} />
                    <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                    <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
                    <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
                    <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
                    <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
                    <Route path="/notifications-test" element={<MainLayout><NotificationsTestPage /></MainLayout>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<MainLayout><AdminDashboardPage /></MainLayout>} />
                    <Route path="/admin/users" element={<MainLayout><AdminUsersPage /></MainLayout>} />
                    <Route path="/admin/restaurants" element={<MainLayout><AdminRestaurantsPage /></MainLayout>} />
                    <Route path="/admin/finances" element={<MainLayout><AdminFinancesPage /></MainLayout>} />
                    <Route path="/admin/notifications" element={<MainLayout><AdminNotificationsPage /></MainLayout>} />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
                  </Routes>
                </BrowserRouter>
              </AdminProvider>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
