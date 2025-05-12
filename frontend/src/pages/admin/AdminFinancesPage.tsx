import React, { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAdmin } from "@/contexts/AdminContext";
import { useNotification } from "@/contexts/NotificationContext";

// Mock data (as in your file)
const revenueData = [
  { name: "Jan", revenue: 4000, expenses: 2400, profit: 1600 },
  { name: "Feb", revenue: 3000, expenses: 1398, profit: 1602 },
  { name: "Mar", revenue: 2000, expenses: 800, profit: 1200 },
  { name: "Apr", revenue: 2780, expenses: 1908, profit: 872 },
  { name: "May", revenue: 1890, expenses: 1800, profit: 90 },
  { name: "Jun", revenue: 2390, expenses: 1800, profit: 590 },
];

const paymentTransactions = [
  {
    id: "PMT001",
    orderId: "ORD1234",
    customer: "John Doe",
    amount: 42.50,
    date: "2023-11-15 14:23",
    status: "completed",
    method: "Credit Card"
  },
  {
    id: "PMT002",
    orderId: "ORD1235",
    customer: "Sarah Johnson",
    amount: 28.75,
    date: "2023-11-15 15:12",
    status: "completed",
    method: "PayPal"
  },
  {
    id: "PMT003",
    orderId: "ORD1236",
    customer: "Mike Wilson",
    amount: 35.20,
    date: "2023-11-15 16:05",
    status: "failed",
    method: "Credit Card"
  },
  {
    id: "PMT004",
    orderId: "ORD1237",
    customer: "Lisa Thompson",
    amount: 52.80,
    date: "2023-11-15 16:58",
    status: "completed",
    method: "Debit Card"
  },
];

const restaurantPayouts = [
  {
    id: "PAY001",
    restaurant: "Thai Delight",
    amount: 1250.80,
    period: "Nov 1-15, 2023",
    status: "pending",
    orders: 45,
  },
  {
    id: "PAY002",
    restaurant: "Pizza Palace",
    amount: 1872.50,
    period: "Nov 1-15, 2023",
    status: "completed",
    orders: 63,
  },
  {
    id: "PAY003",
    restaurant: "Burger Joint",
    amount: 985.25,
    period: "Nov 1-15, 2023",
    status: "pending",
    orders: 32,
  },
];

const driverPayouts = [
  {
    id: "DPY001",
    driver: "David Driver",
    amount: 352.50,
    period: "Nov 1-15, 2023",
    status: "completed",
    deliveries: 47,
  },
  {
    id: "DPY002",
    driver: "Emma Smith",
    amount: 287.75,
    period: "Nov 1-15, 2023",
    status: "pending",
    deliveries: 38,
  },
];

const refundRequests = [
  {
    id: "REF001",
    orderId: "ORD1198",
    customer: "Anthony Brown",
    amount: 28.50,
    reason: "Missing items",
    date: "2023-11-14",
    status: "pending"
  },
  {
    id: "REF002",
    orderId: "ORD1205",
    customer: "Jennifer Lee",
    amount: 42.75,
    reason: "Order never arrived",
    date: "2023-11-15",
    status: "pending"
  },
];

// CSV export utility
function exportToCSV(data: any[], headers: string[], fileName: string) {
  const csvRows = [
    headers.join(","),
    ...data.map(row =>
      headers.map(field => `"${(row[field] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    )
  ];
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const AdminFinancesPage = () => {
  const { processRefund } = useAdmin();
  const { showNotification } = useNotification();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("transactions");

  const handleRefund = (refundId: string, orderId: string, amount: number) => {
    processRefund(orderId, amount);
    showNotification(`Refund processed for order ${orderId} - $${amount}`, "success");
  };

  // Export handler
  const handleExport = () => {
    if (activeTab === "transactions") {
      exportToCSV(
        paymentTransactions,
        ["id", "orderId", "customer", "amount", "date", "method", "status"],
        "payment_transactions.csv"
      );
    } else if (activeTab === "restaurant-payouts") {
      exportToCSV(
        restaurantPayouts,
        ["id", "restaurant", "amount", "period", "orders", "status"],
        "restaurant_payouts.csv"
      );
    } else if (activeTab === "driver-payouts") {
      exportToCSV(
        driverPayouts,
        ["id", "driver", "amount", "period", "deliveries", "status"],
        "driver_payouts.csv"
      );
    } else if (activeTab === "refunds") {
      exportToCSV(
        refundRequests,
        ["id", "orderId", "customer", "amount", "reason", "date", "status"],
        "refund_requests.csv"
      );
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleExport}>
            Export Reports
          </Button>
          <Button>Process All Payouts</Button>
        </div>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Financial overview of the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4ade80" name="Revenue" />
                  <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                  <Bar dataKey="profit" fill="#60a5fa" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="restaurant-payouts">Restaurant Payouts</TabsTrigger>
          <TabsTrigger value="driver-payouts">Driver Payouts</TabsTrigger>
          <TabsTrigger value="refunds">Refund Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>Recent payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.orderId}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === "completed" ? "bg-green-100 text-green-700" : 
                          "bg-red-100 text-red-700"
                        }`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                            </DialogHeader>
                            {selectedTransaction && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Transaction ID</p>
                                    <p>{selectedTransaction.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Order ID</p>
                                    <p>{selectedTransaction.orderId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Customer</p>
                                    <p>{selectedTransaction.customer}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Amount</p>
                                    <p>${selectedTransaction.amount.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Date & Time</p>
                                    <p>{selectedTransaction.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Payment Method</p>
                                    <p>{selectedTransaction.method}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <p>{selectedTransaction.status}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurant-payouts">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Payouts</CardTitle>
              <CardDescription>Pending and completed restaurant payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurantPayouts.map(payout => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.id}</TableCell>
                      <TableCell>{payout.restaurant}</TableCell>
                      <TableCell>${payout.amount.toFixed(2)}</TableCell>
                      <TableCell>{payout.period}</TableCell>
                      <TableCell>{payout.orders}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payout.status === "completed" ? "bg-green-100 text-green-700" : 
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {payout.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={payout.status === "completed"}
                        >
                          {payout.status === "pending" ? "Process Payout" : "View Details"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="driver-payouts">
          <Card>
            <CardHeader>
              <CardTitle>Driver Earnings</CardTitle>
              <CardDescription>Payouts for delivery personnel</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverPayouts.map(payout => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.id}</TableCell>
                      <TableCell>{payout.driver}</TableCell>
                      <TableCell>${payout.amount.toFixed(2)}</TableCell>
                      <TableCell>{payout.period}</TableCell>
                      <TableCell>{payout.deliveries}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payout.status === "completed" ? "bg-green-100 text-green-700" : 
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {payout.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={payout.status === "completed"}
                        >
                          {payout.status === "pending" ? "Process Payout" : "View Details"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds">
          <Card>
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>Pending and processed refund requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundRequests.map(refund => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-medium">{refund.id}</TableCell>
                      <TableCell>{refund.orderId}</TableCell>
                      <TableCell>{refund.customer}</TableCell>
                      <TableCell>${refund.amount.toFixed(2)}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>{refund.date}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          refund.status === "completed" ? "bg-green-100 text-green-700" : 
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {refund.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={refund.status === "completed"}
                            onClick={() => handleRefund(refund.id, refund.orderId, refund.amount)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={refund.status === "completed"}
                          >
                            Deny
                          </Button>
                        </div>
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

export default AdminFinancesPage;
