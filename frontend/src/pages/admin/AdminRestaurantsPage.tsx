
import React from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/contexts/AdminContext";
import { useNotification } from "@/contexts/NotificationContext";

// Mock data for restaurant applications
const pendingRestaurants = [
  {
    id: "101",
    name: "Thai Delight",
    owner: "Lisa Wong",
    email: "lisa@thaidelight.com",
    phone: "555-123-4567",
    applied: "2023-11-15",
    address: "123 Main St, New York, NY",
    cuisine: "Thai",
  },
  {
    id: "102",
    name: "Pasta Paradise",
    owner: "Mario Rossi",
    email: "mario@pastaparadise.com",
    phone: "555-987-6543",
    applied: "2023-11-14",
    address: "456 Elm St, Chicago, IL",
    cuisine: "Italian",
  },
  {
    id: "103",
    name: "Sushi Master",
    owner: "Takeshi Yamada",
    email: "takeshi@sushimaster.com",
    phone: "555-456-7890",
    applied: "2023-11-12",
    address: "789 Oak St, San Francisco, CA",
    cuisine: "Japanese",
  },
];

const recentlyApprovedRestaurants = [
  {
    id: "201",
    name: "Burger Joint",
    owner: "Bob Burger",
    approvedDate: "2023-11-10",
    status: "active",
  },
  {
    id: "202",
    name: "Taco Palace",
    owner: "Elena Rodriguez",
    approvedDate: "2023-11-08",
    status: "active",
  },
];

const rejectedRestaurants = [
  {
    id: "301",
    name: "Quick Snacks",
    owner: "James Quick",
    rejectedDate: "2023-11-09",
    reason: "Incomplete documentation",
  },
  {
    id: "302",
    name: "Midnight Munchies",
    owner: "Samantha Night",
    rejectedDate: "2023-11-05",
    reason: "Failed quality standards",
  },
];

const AdminRestaurantsPage = () => {
  const { approveRestaurant, rejectRestaurant } = useAdmin();
  const { showNotification } = useNotification();
  
  const handleApprove = (id: string, name: string) => {
    approveRestaurant(id);
    showNotification(`Restaurant "${name}" has been approved.`, "success");
  };
  
  const handleReject = (id: string, name: string) => {
    rejectRestaurant(id);
    showNotification(`Restaurant "${name}" has been rejected.`, "error");
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Restaurant Approval</h1>
        <Badge className="text-sm" variant="outline">{pendingRestaurants.length} Pending Approvals</Badge>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending ({pendingRestaurants.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({recentlyApprovedRestaurants.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRestaurants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-6">
            {pendingRestaurants.map(restaurant => (
              <Card key={restaurant.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{restaurant.name}</CardTitle>
                      <CardDescription>Applied on {restaurant.applied}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                        onClick={() => handleApprove(restaurant.id, restaurant.name)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                        onClick={() => handleReject(restaurant.id, restaurant.name)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Owner Information</h3>
                      <p className="text-sm">{restaurant.owner}</p>
                      <p className="text-sm">{restaurant.email}</p>
                      <p className="text-sm">{restaurant.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Restaurant Details</h3>
                      <p className="text-sm">Cuisine: {restaurant.cuisine}</p>
                      <p className="text-sm">Address: {restaurant.address}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-1">Documents</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View License</Button>
                      <Button variant="outline" size="sm">View Health Certificate</Button>
                      <Button variant="outline" size="sm">View Menu</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Recently Approved Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentlyApprovedRestaurants.map(restaurant => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.owner}</TableCell>
                      <TableCell>{restaurant.approvedDate}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {restaurant.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Restaurant Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Rejected Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedRestaurants.map(restaurant => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.owner}</TableCell>
                      <TableCell>{restaurant.rejectedDate}</TableCell>
                      <TableCell>{restaurant.reason}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
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

export default AdminRestaurantsPage;
