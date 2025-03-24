"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, Mail, Phone } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample customer data
const initialCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    totalSpent: 12500,
    lastPurchase: "2023-03-15",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    totalSpent: 8750,
    lastPurchase: "2023-03-10",
    status: "active",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "9876543212",
    totalSpent: 5200,
    lastPurchase: "2023-02-28",
    status: "inactive",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "9876543213",
    totalSpent: 15800,
    lastPurchase: "2023-03-18",
    status: "active",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@example.com",
    phone: "9876543214",
    totalSpent: 3200,
    lastPurchase: "2023-01-15",
    status: "inactive",
  },
]

// Sample purchase history
const purchaseHistory = [
  {
    id: "INV-001",
    date: "2023-03-15",
    amount: 2500,
    items: 3,
    status: "paid",
  },
  {
    id: "INV-002",
    date: "2023-02-28",
    amount: 4800,
    items: 5,
    status: "paid",
  },
  {
    id: "INV-003",
    date: "2023-02-10",
    amount: 1200,
    items: 2,
    status: "paid",
  },
  {
    id: "INV-004",
    date: "2023-01-05",
    amount: 3500,
    items: 4,
    status: "paid",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [filteredCustomers, setFilteredCustomers] = useState(initialCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<any>(null)

  // Form states
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm),
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchTerm, customers])

  const handleAddCustomer = () => {
    if (!customerName || !customerPhone) {
      alert("Please fill in all required fields")
      return
    }

    const newCustomer = {
      id: (customers.length + 1).toString(),
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      totalSpent: 0,
      lastPurchase: "-",
      status: "active",
    }

    setCustomers([...customers, newCustomer])
    resetForm()
    setShowAddDialog(false)
  }

  const handleEditCustomer = () => {
    if (!currentCustomer) return

    if (!customerName || !customerPhone) {
      alert("Please fill in all required fields")
      return
    }

    const updatedCustomer = {
      ...currentCustomer,
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
    }

    const updatedCustomers = customers.map((c) => (c.id === currentCustomer.id ? updatedCustomer : c))

    setCustomers(updatedCustomers)
    resetForm()
    setShowEditDialog(false)
  }

  const handleDeleteCustomer = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      const updatedCustomers = customers.filter((c) => c.id !== id)
      setCustomers(updatedCustomers)
    }
  }

  const openEditDialog = (customer: any) => {
    setCurrentCustomer(customer)
    setCustomerName(customer.name)
    setCustomerEmail(customer.email || "")
    setCustomerPhone(customer.phone)
    setShowEditDialog(true)
  }

  const openCustomerDetails = (customer: any) => {
    setCurrentCustomer(customer)
    setShowCustomerDetails(true)
  }

  const resetForm = () => {
    setCustomerName("")
    setCustomerEmail("")
    setCustomerPhone("")
    setCurrentCustomer(null)
  }

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Customers" text="Manage your customer database and view customer details.">
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </DashboardHeader>

        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="cursor-pointer" onClick={() => openCustomerDetails(customer)}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="text-right">₹{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>{customer.lastPurchase}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        customer.status === "active" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                      }
                    >
                      {customer.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditDialog(customer)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `mailto:${customer.email}`
                          }}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `tel:${customer.phone}`
                          }}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCustomer(customer.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Customer Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Add a new customer to your database.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9876543210"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>Update customer details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Customer Name</Label>
                <Input id="edit-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email (Optional)</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input id="edit-phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCustomer}>Update Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Customer Details Dialog */}
        <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>View detailed information about this customer.</DialogDescription>
            </DialogHeader>
            {currentCustomer && (
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{currentCustomer.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentCustomer.email || "No email provided"}</p>
                    <p className="text-sm text-muted-foreground">{currentCustomer.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-lg font-semibold">₹{currentCustomer.totalSpent.toLocaleString()}</p>
                    <Badge
                      variant="outline"
                      className={
                        currentCustomer.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }
                    >
                      {currentCustomer.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <Tabs defaultValue="purchases" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="purchases" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Purchase History</CardTitle>
                        <CardDescription>Recent transactions by this customer.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Invoice</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                              <TableHead className="text-right">Items</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {purchaseHistory.map((purchase) => (
                              <TableRow key={purchase.id}>
                                <TableCell className="font-medium">{purchase.id}</TableCell>
                                <TableCell>{purchase.date}</TableCell>
                                <TableCell className="text-right">₹{purchase.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{purchase.items}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      purchase.status === "paid"
                                        ? "bg-green-50 text-green-700"
                                        : "bg-yellow-50 text-yellow-700"
                                    }
                                  >
                                    {purchase.status === "paid" ? "Paid" : "Pending"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="notes" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Notes</CardTitle>
                        <CardDescription>Add notes about this customer.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="min-h-[100px] border rounded-md p-3">
                          <p className="text-sm text-muted-foreground italic">No notes available for this customer.</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Add Note
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowCustomerDetails(false)
                  openEditDialog(currentCustomer)
                }}
              >
                Edit Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardShell>
    </DashboardLayout>
  )
}

