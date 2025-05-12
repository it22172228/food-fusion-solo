import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  Legend
} from 'recharts';
import { BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data for reports
const monthlyRevenueData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1900 },
  { name: 'Mar', value: 2400 },
  { name: 'Apr', value: 1800 },
  { name: 'May', value: 2700 },
  { name: 'Jun', value: 3100 },
  { name: 'Jul', value: 2900 },
  { name: 'Aug', value: 3400 },
  { name: 'Sep', value: 3800 },
  { name: 'Oct', value: 3500 },
  { name: 'Nov', value: 4200 },
  { name: 'Dec', value: 4800 },
];

const weeklyOrdersData = [
  { name: 'Mon', orders: 45 },
  { name: 'Tue', orders: 52 },
  { name: 'Wed', orders: 38 },
  { name: 'Thu', orders: 70 },
  { name: 'Fri', orders: 91 },
  { name: 'Sat', orders: 123 },
  { name: 'Sun', orders: 85 },
];

const categoryData = [
  { name: 'Asian Fusion', value: 35 },
  { name: 'Italian', value: 25 },
  { name: 'Mexican', value: 15 },
  { name: 'Desserts', value: 10 },
  { name: 'Vegetarian', value: 15 },
];

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#FF6384', '#36A2EB'];

const popularItems = [
  { 
    name: 'Spicy Tuna Sushi Burrito', 
    orders: 124, 
    revenue: 1984.76, 
    growth: 12 
  },
  { 
    name: 'Truffle Mushroom Pasta', 
    orders: 86, 
    revenue: 1632.14, 
    growth: 5 
  },
  { 
    name: 'Korean BBQ Tacos', 
    orders: 68, 
    revenue: 1019.32, 
    growth: -2 
  },
  { 
    name: 'Mango Sticky Rice', 
    orders: 55, 
    revenue: 824.45, 
    growth: 8 
  },
  { 
    name: 'Avocado Toast', 
    orders: 49, 
    revenue: 735.51, 
    growth: 3 
  },
];

const restaurantMetrics = {
  totalOrders: 421,
  totalRevenue: 12548.92,
  averageOrder: 29.81,
  totalCustomers: 256,
  repeatedCustomers: 178,
  customerRetentionRate: 69.5
};

interface RestaurantAnalyticsProps {
  className?: string;
}

const RestaurantAnalytics: React.FC<RestaurantAnalyticsProps> = ({ className }) => {
  return (
    <div className={className}>
      <h2 className="font-semibold text-xl mb-6">Business Analytics</h2>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Orders</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{restaurantMetrics.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${restaurantMetrics.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Order</CardTitle>
            <CardDescription>Value</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${restaurantMetrics.averageOrder.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="mb-6">
          <TabsTrigger value="revenue">
            <LineChartIcon className="mr-2 h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="orders">
            <BarChart2 className="mr-2 h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends over the past year</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer config={{}} className="h-72">
                <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Retention</CardTitle>
              <CardDescription>New vs. returning customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm font-medium mb-1">Total Customers</p>
                  <p className="text-2xl font-bold">{restaurantMetrics.totalCustomers}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Returning Customers</p>
                  <p className="text-2xl font-bold">{restaurantMetrics.repeatedCustomers}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Retention Rate</p>
                  <p className="text-2xl font-bold">{restaurantMetrics.customerRetentionRate}%</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${restaurantMetrics.customerRetentionRate}%` }} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Orders</CardTitle>
              <CardDescription>Orders received per day this week</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer config={{}} className="h-72">
                <BarChart data={weeklyOrdersData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across food categories</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                  <ChartContainer config={{}} className="h-72">
                    <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryData.map((item, index) => (
                        <TableRow key={item.name}>
                          <TableCell className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                            />
                            {item.name}
                          </TableCell>
                          <TableCell className="text-right">{item.value}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Popular items table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Popular Items</CardTitle>
          <CardDescription>Most ordered items from your menu</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularItems.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.orders}</TableCell>
                  <TableCell className="text-right">${item.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={`ml-auto ${item.growth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                      {item.growth > 0 ? '+' : ''}{item.growth}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-3">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-sm">
          {payload[0].name}: {payload[0].dataKey === "value" ? "$" : ""}
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default RestaurantAnalytics;
