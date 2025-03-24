"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Package, BarChart, Users, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AIAssistant } from "@/components/ai-assistant"

// Sample data for the chart
const salesData = [
  { day: "Mon", sales: 4000 },
  { day: "Tue", sales: 3000 },
  { day: "Wed", sales: 5000 },
  { day: "Thu", sales: 2780 },
  { day: "Fri", sales: 1890 },
  { day: "Sat", sales: 2390 },
  { day: "Sun", sales: 3490 },
]

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalSales: 0,
    totalInvoices: 0,
    lowStockItems: 0,
    pendingPayments: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState<any[]>([])

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      }
    }

    // Load recent invoices from localStorage
    const loadRecentInvoices = () => {
      const storedInvoices = localStorage.getItem("invoices-history")
      if (storedInvoices) {
        const allInvoices = JSON.parse(storedInvoices)
        // Sort by date (newest first) and take the first 3
        const sorted = [...allInvoices]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)

        setRecentInvoices(sorted)
      }
    }

    fetchStats()
    loadRecentInvoices()
  }, [])

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Welcome to ScanPOS, your complete point of sale solution.">
          <Button onClick={() => router.push("/invoice/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </DashboardHeader>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button onClick={() => router.push("/invoice/new")} className="h-auto py-4 flex flex-col gap-2">
                <ShoppingCart className="h-6 w-6" />
                <span>New Invoice</span>
              </Button>
              <Button
                onClick={() => router.push("/inventory")}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2"
              >
                <Package className="h-6 w-6" />
                <span>Inventory</span>
              </Button>
              <Button
                onClick={() => router.push("/customers")}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Customers</span>
              </Button>
              <Button
                onClick={() => router.push("/analytics")}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2"
              >
                <BarChart className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
                  <div key={invoice.invoiceNumber} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">Customer: {invoice.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{invoice.total.toFixed(2)}</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Paid
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">No invoices created yet</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/invoices")}>
              View All Invoices
            </Button>
          </CardFooter>
        </Card>

        {/* AI Assistant */}
        <AIAssistant />
      </DashboardShell>
    </DashboardLayout>
  )
}

