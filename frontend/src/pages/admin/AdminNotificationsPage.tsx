
import React, { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdmin } from "@/contexts/AdminContext";
import { useNotification } from "@/contexts/NotificationContext";
import { Bell, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data
const notificationLogs = [
  {
    id: "NTF001",
    type: "Order Confirmation",
    recipient: "John Doe",
    method: "SMS",
    status: "delivered",
    timestamp: "2023-11-15 14:32",
  },
  {
    id: "NTF002",
    type: "Delivery Update",
    recipient: "Sarah Johnson",
    method: "Email",
    status: "delivered",
    timestamp: "2023-11-15 14:45",
  },
  {
    id: "NTF003",
    type: "Order Ready",
    recipient: "Pizza Palace",
    method: "SMS",
    status: "failed",
    timestamp: "2023-11-15 15:10",
  },
  {
    id: "NTF004",
    type: "Account Suspension",
    recipient: "Taco Truck",
    method: "Email",
    status: "delivered",
    timestamp: "2023-11-15 15:25",
  },
];

// Security logs
const securityLogs = [
  {
    id: "SEC001",
    event: "Admin Login",
    user: "admin@foodfusion.com",
    ip: "192.168.1.1",
    timestamp: "2023-11-15 09:15",
    severity: "info",
  },
  {
    id: "SEC002",
    event: "Failed Login Attempt",
    user: "unknown@example.com",
    ip: "45.67.89.123",
    timestamp: "2023-11-15 10:22",
    severity: "warning",
  },
  {
    id: "SEC003",
    event: "Restaurant Account Suspended",
    user: "admin@foodfusion.com",
    ip: "192.168.1.1",
    timestamp: "2023-11-15 11:05",
    severity: "critical",
  },
];

const notificationTypes = [
  { 
    id: "newOrder",
    name: "New Order",
    description: "Sent when a customer places a new order",
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
  },
  { 
    id: "orderDelivered", 
    name: "Order Delivered", 
    description: "Sent when an order is delivered",
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
  },
  { 
    id: "accountSuspended", 
    name: "Account Suspended", 
    description: "Sent when an account is suspended",
    smsEnabled: false,
    emailEnabled: true,
    pushEnabled: false,
  },
  { 
    id: "restaurantApproved", 
    name: "Restaurant Approved", 
    description: "Sent when a restaurant is approved",
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
  },
];

const AdminNotificationsPage = () => {
  const { notificationTemplates, updateNotificationTemplate } = useAdmin();
  const { showNotification } = useNotification();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [newTemplateText, setNewTemplateText] = useState("");

  const handleSaveTemplate = () => {
    if (selectedTemplate && newTemplateText) {
      updateNotificationTemplate(selectedTemplate.id, newTemplateText);
      showNotification("Notification template updated successfully", "success");
    }
  };

  const sendTestNotification = (type: string) => {
    showNotification(`Test ${type} notification sent`, "success");
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications & System Logs</h1>
      </div>

      <Tabs defaultValue="templates">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">Notification Templates</TabsTrigger>
          <TabsTrigger value="logs">Notification Logs</TabsTrigger>
          <TabsTrigger value="security">Security Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Configure templates for various notification types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {notificationTypes.map(template => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-1">
                          <Badge variant={template.smsEnabled ? "default" : "outline"}>SMS</Badge>
                          <Badge variant={template.emailEnabled ? "default" : "outline"}>Email</Badge>
                          <Badge variant={template.pushEnabled ? "default" : "outline"}>Push</Badge>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setNewTemplateText(notificationTemplates[template.id] || "");
                              }}
                            >
                              Edit Template
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Template: {selectedTemplate?.name}</DialogTitle>
                            </DialogHeader>
                            {selectedTemplate && (
                              <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                  Use {{variable}} syntax for dynamic content.
                                  Available variables: {{orderId}}, {{customerName}}, {{restaurant}}, etc.
                                </p>
                                <textarea
                                  className="w-full h-32 border rounded-md p-2"
                                  value={newTemplateText}
                                  onChange={(e) => setNewTemplateText(e.target.value)}
                                />
                                <div className="flex justify-between">
                                  <Button
                                    variant="outline"
                                    onClick={() => sendTestNotification(selectedTemplate.name)}
                                    className="flex items-center gap-2"
                                  >
                                    <Send className="h-4 w-4" /> Send Test
                                  </Button>
                                  <Button onClick={handleSaveTemplate}>Save Changes</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => sendTestNotification(template.name)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      <p>{notificationTemplates[template.id] || "No template configured"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Notification Logs</CardTitle>
              <CardDescription>History of sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.recipient}</TableCell>
                      <TableCell>{log.method}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          log.status === "delivered" ? "bg-green-100 text-green-700" : 
                          "bg-red-100 text-red-700"
                        }`}>
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>System security events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.event}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          log.severity === "info" ? "bg-blue-100 text-blue-700" : 
                          log.severity === "warning" ? "bg-yellow-100 text-yellow-700" : 
                          "bg-red-100 text-red-700"
                        }`}>
                          {log.severity}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminNotificationsPage;
