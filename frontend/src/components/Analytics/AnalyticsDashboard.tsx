import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, ChartBar, Star } from "lucide-react";

const salesData = [
  { name: "Jan", revenue: 29000, orders: 120 },
  { name: "Feb", revenue: 35000, orders: 145 },
  { name: "Mar", revenue: 42000, orders: 180 },
  { name: "Apr", revenue: 38000, orders: 160 },
  { name: "May", revenue: 45000, orders: 190 },
  { name: "Jun", revenue: 52000, orders: 210 },
  { name: "Jul", revenue: 58000, orders: 235 },
  { name: "Aug", revenue: 62000, orders: 250 },
  { name: "Sep", revenue: 56000, orders: 225 },
  { name: "Oct", revenue: 64000, orders: 265 },
  { name: "Nov", revenue: 70000, orders: 285 },
  { name: "Dec", revenue: 78000, orders: 310 },
];

const popularCuisineData = [
  { name: "Italian", value: 30 },
  { name: "American", value: 25 },
  { name: "Indian", value: 20 },
  { name: "Japanese", value: 15 },
  { name: "Chinese", value: 10 },
  { name: "Sri Lankan", value: 5 },
];

const restaurantRatingData = [
  { name: "5 Stars", count: 45 },
  { name: "4 Stars", count: 28 },
  { name: "3 Stars", count: 15 },
  { name: "2 Stars", count: 8 },
  { name: "1 Star", count: 4 },
];

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 629,000</div>
            <p className="text-xs text-muted-foreground">+20.1% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ChartBar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,575</div>
            <p className="text-xs text-muted-foreground">+15.3% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Restaurants</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 min</div>
            <p className="text-xs text-muted-foreground">-8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue & Orders</TabsTrigger>
          <TabsTrigger value="cuisine">Cuisine Breakdown</TabsTrigger>
          <TabsTrigger value="ratings">Restaurant Ratings</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative h-[400px]">
                <ChartContainer
                  config={{
                    revenue: { color: "#FF6384" },
                    orders: { color: "#36A2EB" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <ChartTooltipContent
                                active={active}
                                payload={payload}
                              />
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        activeDot={{ r: 8 }}
                        name="Revenue (Rs.)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="var(--color-orders)"
                        name="Orders"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cuisine">
          <Card>
            <CardHeader>
              <CardTitle>Popular Cuisines</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popularCuisineData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {popularCuisineData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Ratings</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={restaurantRatingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Number of Restaurants"
                      fill="#8884d8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
