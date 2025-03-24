"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, PlusCircle, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { BarcodeScanner } from "@/components/barcode-scanner"

interface Product {
  id: string
  name: string
  price: number
  gst: number
  stock: number
  barcode: string
}

interface InvoiceItem {
  productId: string
  name: string
  price: number
  gst: number
  quantity: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalSpent: number
  lastPurchase: string
  status: string
}

export default function NewInvoice() {
  const router = useRouter()
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [showScanner, setShowScanner] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    // Load existing customers
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    }

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use localStorage to persist products between pages
        const storedProducts = localStorage.getItem("inventory-products")

        let productList: Product[] = []
        if (storedProducts) {
          productList = JSON.parse(storedProducts)
        } else {
          // Fallback to mock data if no stored products
          productList = [
            { id: "1", name: "Wireless Mouse", price: 1200, gst: 18, stock: 25, barcode: "8901234567890" },
            { id: "2", name: "USB-C Cable", price: 450, gst: 18, stock: 50, barcode: "8901234567891" },
            { id: "3", name: "Bluetooth Speaker", price: 2500, gst: 18, stock: 15, barcode: "8901234567892" },
            { id: "4", name: "Laptop Bag", price: 1800, gst: 12, stock: 20, barcode: "8901234567893" },
            { id: "5", name: "Wireless Keyboard", price: 1500, gst: 18, stock: 18, barcode: "8901234567894" },
          ]
        }

        setProducts(productList)
        setFilteredProducts(productList)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const handleAddItem = (product: Product) => {
    const existingItemIndex = invoiceItems.findIndex((item) => item.productId === product.id)

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...invoiceItems]
      updatedItems[existingItemIndex].quantity += 1
      setInvoiceItems(updatedItems)
    } else {
      // Add new item
      setInvoiceItems([
        ...invoiceItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          gst: product.gst,
          quantity: 1,
        },
      ])
    }
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...invoiceItems]
    updatedItems.splice(index, 1)
    setInvoiceItems(updatedItems)
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return

    const updatedItems = [...invoiceItems]
    updatedItems[index].quantity = quantity
    setInvoiceItems(updatedItems)
  }

  const handleBarcodeDetected = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode)
    if (product) {
      handleAddItem(product)
      setShowScanner(false)
    }
  }

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateGST = () => {
    return invoiceItems.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      return sum + (itemTotal * item.gst) / 100
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST()
  }

  const saveCustomerData = () => {
    if (!customerName || !customerPhone) return

    const total = calculateTotal()
    const today = new Date().toISOString().split("T")[0]

    // Check if customer already exists
    const existingCustomerIndex = customers.findIndex(
      (c) => c.phone === customerPhone || (customerEmail && c.email === customerEmail),
    )

    if (existingCustomerIndex >= 0) {
      // Update existing customer
      const updatedCustomers = [...customers]
      updatedCustomers[existingCustomerIndex] = {
        ...updatedCustomers[existingCustomerIndex],
        name: customerName,
        email: customerEmail || updatedCustomers[existingCustomerIndex].email,
        phone: customerPhone,
        totalSpent: updatedCustomers[existingCustomerIndex].totalSpent + total,
        lastPurchase: today,
        status: "active",
      }
      setCustomers(updatedCustomers)
      localStorage.setItem("customers", JSON.stringify(updatedCustomers))
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: customerName,
        email: customerEmail || "",
        phone: customerPhone,
        totalSpent: total,
        lastPurchase: today,
        status: "active",
      }

      const newCustomers = [...customers, newCustomer]
      setCustomers(newCustomers)
      localStorage.setItem("customers", JSON.stringify(newCustomers))
    }
  }

  const handleCreateInvoice = async () => {
    if (!customerName || !customerPhone || invoiceItems.length === 0) {
      alert("Please fill in customer details and add at least one item")
      return
    }

    try {
      // Save customer data
      saveCustomerData()

      const invoiceData = {
        invoiceNumber: `INV-${Date.now()}`,
        customerName,
        customerEmail,
        customerPhone,
        items: invoiceItems,
        subtotal: calculateSubtotal(),
        gst: calculateGST(),
        total: calculateTotal(),
        createdAt: new Date().toISOString(),
      }

      // Store the invoice data in localStorage
      localStorage.setItem("current-invoice", JSON.stringify(invoiceData))

      // Also store in invoices history
      const storedInvoices = localStorage.getItem("invoices-history") || "[]"
      const invoicesHistory = JSON.parse(storedInvoices)
      invoicesHistory.push(invoiceData)
      localStorage.setItem("invoices-history", JSON.stringify(invoicesHistory))

      // Redirect to payment page
      router.push(`/invoice/payment?id=${invoiceData.invoiceNumber}`)
    } catch (error) {
      console.error("Failed to create invoice:", error)
      alert("Failed to create invoice. Please try again.")
    }
  }

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Create New Invoice" text="Add items and customer details to generate an invoice.">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowScanner(!showScanner)}>
              {showScanner ? "Hide Scanner" : "Scan Barcode"}
            </Button>
            <Button onClick={handleCreateInvoice}>
              <Save className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </DashboardHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerEmail">Email (Optional)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or scan barcode"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              {showScanner && (
                <div className="mb-4">
                  <BarcodeScanner onDetected={handleBarcodeDetected} />
                </div>
              )}
              <div className="h-[200px] overflow-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{product.stock}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAddItem(product)}
                            disabled={product.stock <= 0}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">GST</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.gst}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleQuantityChange(index, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleQuantityChange(index, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{(item.price * item.quantity + (item.price * item.quantity * item.gst) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {invoiceItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No items added to invoice
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col items-end space-y-2">
            <div className="flex justify-between w-full md:w-1/3">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full md:w-1/3">
              <span>GST:</span>
              <span>₹{calculateGST().toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full md:w-1/3 font-bold">
              <span>Total:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>
      </DashboardShell>
    </DashboardLayout>
  )
}

