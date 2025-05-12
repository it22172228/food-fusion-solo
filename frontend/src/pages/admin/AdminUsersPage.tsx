import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";

const AdminUsersPage = () => {
  const { showNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      showNotification("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter users by role and search
  const filterUsers = (role: string) =>
    users.filter(
      (user: any) =>
        user.role === role &&
        (user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()))
    );

  // Update user status (activate/suspend)
  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" || currentStatus === "pending" ? "suspended" : "active";
    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${id}`, { status: newStatus });
      showNotification(
        `User account ${newStatus === "suspended" ? "suspended" : "activated"}`,
        newStatus === "suspended" ? "warning" : "success"
      );
      fetchUsers();
    } catch (err) {
      showNotification("Failed to update status", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Users & Account Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-md w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Customers ({filterUsers("customer").length})</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants ({filterUsers("restaurant").length})</TabsTrigger>
          <TabsTrigger value="drivers">Delivery Personnel ({filterUsers("delivery").length})</TabsTrigger>
        </TabsList>

        {/* Customers */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Customer Accounts</CardTitle>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterUsers("customer").map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(user._id, user.status)}
                          >
                            {user.status === "active" || user.status === "pending" ? "Suspend" : "Activate"}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-sm font-medium">Name</h3>
                                    <p>{selectedUser.name}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Email</h3>
                                    <p>{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Joined</h3>
                                    <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Account Status</h3>
                                    <p>{selectedUser.status}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Role</h3>
                                    <p>{selectedUser.role}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {loading && <div className="text-center py-4">Loading...</div>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restaurants */}
        <TabsContent value="restaurants">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Restaurant Accounts</CardTitle>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterUsers("restaurant").map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(user._id, user.status)}
                          >
                            {user.status === "active" || user.status === "pending" ? "Suspend" : "Activate"}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Restaurant Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-sm font-medium">Name</h3>
                                    <p>{selectedUser.name}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Email</h3>
                                    <p>{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Registered</h3>
                                    <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Account Status</h3>
                                    <p>{selectedUser.status}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Role</h3>
                                    <p>{selectedUser.role}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {loading && <div className="text-center py-4">Loading...</div>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Personnel */}
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Delivery Personnel</CardTitle>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterUsers("delivery").map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(user._id, user.status)}
                          >
                            {user.status === "active" || user.status === "pending" ? "Suspend" : "Activate"}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delivery Personnel Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-sm font-medium">Name</h3>
                                    <p>{selectedUser.name}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Email</h3>
                                    <p>{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Joined</h3>
                                    <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Account Status</h3>
                                    <p>{selectedUser.status}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Role</h3>
                                    <p>{selectedUser.role}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {loading && <div className="text-center py-4">Loading...</div>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminUsersPage;
