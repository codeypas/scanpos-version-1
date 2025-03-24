"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, PlusCircle, Eye } from "lucide-react"

interface Invoice {
  invoiceNumber: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  items: Array<{
    name: string
    price: number
    quantity: number
    gst: number
  }>
  subtotal: number
  gst: number
  total: number
  createdAt: string
  status?: string
}

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Load invoices from localStorage
    const storedInvoices = localStorage.getItem("invoices-history")
    if (storedInvoices) {
      const parsedInvoices = JSON.parse(storedInvoices)
      // Add status if not present
      const invoicesWithStatus = parsedInvoices.map((invoice: Invoice) => ({
        ...invoice,
        status: invoice.status || "paid",
      }))
      setInvoices(invoicesWithStatus)
      setFilteredInvoices(invoicesWithStatus)
    }
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = invoices.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerPhone.includes(searchTerm),
      )
      setFilteredInvoices(filtered)
    } else {
      setFilteredInvoices(invoices)
    }
  }, [searchTerm, invoices])

  const handleViewInvoice = (invoiceNumber: string) => {
    router.push(`/invoice/payment?id=${invoiceNumber}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Invoices" text="View and manage all your invoices.">
          <Button onClick={() => router.push("/invoice/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </DashboardHeader>

        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices by number, customer name, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Card>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.invoiceNumber}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>
                        <div>
                          <p>{invoice.customerName}</p>
                          <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">₹{invoice.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            invoice.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                          }
                        >
                          {invoice.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewInvoice(invoice.invoiceNumber)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm ? (
                        <p>No invoices found matching your search.</p>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <p>No invoices have been created yet.</p>
                          <Button variant="outline" size="sm" onClick={() => router.push("/invoice/new")}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create your first invoice
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </DashboardShell>
    </DashboardLayout>
  )
}

