
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotification } from "@/contexts/NotificationContext";

const NotificationsTestPage = () => {
  const { showNotification, notifications, clearNotifications } = useNotification();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Notifications Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Notifications</CardTitle>
            <CardDescription>
              Use these buttons to test different types of notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => showNotification("Your order has been placed successfully!", "success")}
                className="bg-green-600 hover:bg-green-700"
              >
                Success Notification
              </Button>
              
              <Button 
                onClick={() => showNotification("Failed to process payment, please try again.", "error")}
                variant="destructive"
              >
                Error Notification
              </Button>
              
              <Button 
                onClick={() => showNotification("Your order is being prepared.", "info")}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Info Notification
              </Button>
              
              <Button 
                onClick={() => showNotification("Your delivery might be delayed due to traffic.", "warning")}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Warning Notification
              </Button>
            </div>
            
            <Button 
              onClick={() => showNotification("Your delivery driver is on the way!", "success")}
              variant="outline"
              className="w-full"
            >
              Send Delivery Update
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              {notifications.length} notifications in your history
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notifications to display
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border rounded-md ${
                      notification.type === 'success' ? 'border-green-200 bg-green-50' :
                      notification.type === 'error' ? 'border-red-200 bg-red-50' :
                      notification.type === 'warning' ? 'border-amber-200 bg-amber-50' :
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1">{notification.message}</p>
                  </div>
                ))}
                <Button 
                  onClick={clearNotifications} 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                >
                  Clear All Notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsTestPage;
