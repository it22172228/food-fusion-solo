import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { orders } from "@/data/mockData";
import { restaurants } from "@/data/mockData";
import { PackageCheck, PackageX, Clock, PackageOpen } from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";
import { useEffect } from "react";

const OrdersPage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  // Filter orders by the current user
  const userOrders = user ? orders.filter((order) => order.customerId === user.id) : [];

  const activeOrders = userOrders.filter(
    (order) => order.status === "in_progress" || order.status === "accepted" || order.status === "preparing" || order.status === "ready_for_pickup"
  );
  
  const completedOrders = userOrders.filter(
    (order) => order.status === "delivered" || order.status === "completed"
  );

  // Simulate real-time order updates with notifications
  useEffect(() => {
    if (!user) return;
    
    // Only run once when the component is mounted
    const demoNotificationTimeout = setTimeout(() => {
      // Only show if there are active orders
      if (activeOrders.length > 0) {
        const randomOrder = activeOrders[Math.floor(Math.random() * activeOrders.length)];
        const restaurantName = getRestaurantName(randomOrder.restaurantId);
        
        showNotification(
          `Your order from ${restaurantName} is now ready for pickup!`,
          "success"
        );
      }
    }, 15000); // Show after 15 seconds
    
    return () => clearTimeout(demoNotificationTimeout);
  }, [user, activeOrders.length]);

  const getRestaurantName = (restaurantId: string): string => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant?.name || "Unknown Restaurant";
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <PackageCheck className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <PackageX className="h-5 w-5 text-destructive" />;
      case "in_progress":
      case "accepted":
      case "preparing":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "ready_for_pickup":
        return <PackageOpen className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200">In Progress</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Accepted</Badge>;
      case "preparing":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Preparing</Badge>;
      case "ready_for_pickup":
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-200">Ready for Pickup</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
        <Link to="/login" className="text-primary hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Order History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activeOrders.length > 0 ? (
            <div className="space-y-6">
              {activeOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                        <CardTitle className="text-lg mt-1">{getRestaurantName(order.restaurantId)}</CardTitle>
                      </div>
                      {getOrderStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Items:</p>
                        <ul className="space-y-1 pl-5 list-disc">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.quantity}x {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-3 border-t">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            Ordered: {formatDate(order.placedAt)}
                          </span>
                        </div>
                        <div className="font-medium">
                          Total: Rs. {order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No active orders</h2>
              <p className="text-muted-foreground mb-6">You don't have any active orders at the moment.</p>
              <Link
                to="/restaurants"
                className="text-primary hover:underline"
              >
                Browse restaurants
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedOrders.length > 0 ? (
            <div className="space-y-6">
              {completedOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                        <CardTitle className="text-lg mt-1">{getRestaurantName(order.restaurantId)}</CardTitle>
                      </div>
                      {getOrderStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Items:</p>
                        <ul className="space-y-1 pl-5 list-disc">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.quantity}x {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-3 border-t">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            Delivered: {formatDate(order.deliveredAt || order.placedAt)}
                          </span>
                        </div>
                        <div className="font-medium">
                          Total: Rs. {order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No order history</h2>
              <p className="text-muted-foreground mb-6">You haven't completed any orders yet.</p>
              <Link
                to="/restaurants"
                className="text-primary hover:underline"
              >
                Browse restaurants
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
