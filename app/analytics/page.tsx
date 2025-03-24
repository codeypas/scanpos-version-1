"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart, ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart"
import { Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data for charts
const salesData = [
  { month: "Jan", sales: 4000, profit: 2400 },
  { month: "Feb", sales: 3000, profit: 1398 },
  { month: "Mar", sales: 2000, profit: 9800 },
  { month: "Apr", sales: 2780, profit: 3908 },
  { month: "May", sales: 1890, profit: 4800 },
  { month: "Jun", sales: 2390, profit: 3800 },
  { month: "Jul", sales: 3490, profit: 4300 },
  { month: "Aug", sales: 4000, profit: 2400 },
  { month: "Sep", sales: 3000, profit: 1398 },
  { month: "Oct", sales: 2000, profit: 9800 },
  { month: "Nov", sales: 2780, profit: 3908 },
  { month: "Dec", sales: 1890, profit: 4800 },
]

const categoryData = [
  { name: "Electronics", value: 45 },
  { name: "Accessories", value: 25 },
  { name: "Stationery", value: 15 },
  { name: "Furniture", value: 10 },
  { name: "Others", value: 5 },
]

const inventoryData = [
  { name: "Wireless Mouse", stock: 25, minStock: 10 },
  { name: "USB-C Cable", stock: 5, minStock: 15 },
  { name: "Bluetooth Speaker", stock: 15, minStock: 5 },
  { name: "Laptop Bag", stock: 20, minStock: 8 },
  { name: "Wireless Keyboard", stock: 3, minStock: 10 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Analytics" text="View your business performance and insights.">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </DashboardHeader>

        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Sales</CardTitle>
                  <CardDescription>Sales performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹125,750</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last period</p>
                  <div className="h-[200px] mt-4">
                    <ChartContainer>
                      <Chart>
                        <ResponsiveContainer width="100%" height="100%">
                          <Line data={salesData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<ChartTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="sales"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                            />
                          </Line>
                        </ResponsiveContainer>
                      </Chart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Profit Margin</CardTitle>
                  <CardDescription>Profit trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹42,500</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last period</p>
                  <div className="h-[200px] mt-4">
                    <ChartContainer>
                      <Chart>
                        <ResponsiveContainer width="100%" height="100%">
                          <Area data={salesData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<ChartTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="profit"
                              stroke="hsl(var(--primary))"
                              fill="hsl(var(--primary) / 0.2)"
                            />
                          </Area>
                        </ResponsiveContainer>
                      </Chart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] mt-4">
                    <ChartContainer>
                      <Chart>
                        <ResponsiveContainer width="100%" height="100%">
                          <Bar data={categoryData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="value" fill="hsl(var(--primary))" />
                          </Bar>
                        </ResponsiveContainer>
                      </Chart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sales & Profit Overview</CardTitle>
                <CardDescription>Comprehensive view of business performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <Line data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip content={<ChartTooltip />} />
                          <Legend content={<ChartLegend />} />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="hsl(var(--destructive))"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </Line>
                      </ResponsiveContainer>
                    </Chart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current stock levels vs. minimum required stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <Bar data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltip />} />
                          <Legend content={<ChartLegend />} />
                          <Bar dataKey="stock" fill="hsl(var(--primary))" />
                          <Bar dataKey="minStock" fill="hsl(var(--destructive))" />
                        </Bar>
                      </ResponsiveContainer>
                    </Chart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <Line
                          data={salesData.map((item) => ({ ...item, customers: Math.floor(item.sales / 500) }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip content={<ChartTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="customers"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </Line>
                      </ResponsiveContainer>
                    </Chart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}

