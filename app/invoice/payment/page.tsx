"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Download, Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { InvoiceGenerator } from "@/components/invoice-generator"
import { QRCodeCanvas } from "qrcode.react";

export default function InvoicePayment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invoiceId = searchParams.get("id")

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending")
  const [countdown, setCountdown] = useState(30) // Changed from 60 to 30 seconds
  const [showInvoice, setShowInvoice] = useState(false)

  // Get invoice data from localStorage
  const [invoiceData, setInvoiceData] = useState<any>({
    invoiceNumber: invoiceId || "INV-123",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "9876543210",
    items: [
      {
        name: "Wireless Mouse",
        price: 1200,
        quantity: 1,
        gst: 18,
      },
      {
        name: "USB-C Cable",
        price: 450,
        quantity: 2,
        gst: 18,
      },
    ],
    subtotal: 2100,
    gst: 378,
    total: 2478,
    date: new Date().toISOString().split("T")[0],
  })

  // Add this useEffect to load the invoice data
  useEffect(() => {
    const storedInvoice = localStorage.getItem("current-invoice")
    if (storedInvoice) {
      const parsedInvoice = JSON.parse(storedInvoice)
      setInvoiceData({
        ...parsedInvoice,
        date: new Date(parsedInvoice.createdAt).toISOString().split("T")[0],
      })
    }
  }, [])

  // Load business info from localStorage
  const [businessInfo, setBusinessInfo] = useState({
    name: "ScanPOS Demo Store",
    address: "123 Main Street, City, State, 123456",
    phone: "9876543210",
    email: "contact@scanpos.com",
    gst: "22AAAAA0000A1Z5",
    logo: "/placeholder.svg?height=60&width=150",
  })

  useEffect(() => {
    const storedSettings = localStorage.getItem("business-settings")
    if (storedSettings) {
      const settings = JSON.parse(storedSettings)
      setBusinessInfo({
        name: settings.businessName || businessInfo.name,
        address: settings.businessAddress || businessInfo.address,
        phone: settings.businessPhone || businessInfo.phone,
        email: settings.businessEmail || businessInfo.email,
        gst: settings.businessGST || businessInfo.gst,
        logo: settings.businessLogo || businessInfo.logo,
      })
    }
  }, [])

  useEffect(() => {
    if (paymentStatus === "pending") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Simulate payment verification
            const result = Math.random() > 0.3
            setPaymentStatus(result ? "success" : "failed")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [paymentStatus])

  const handleDownloadInvoice = () => {
    setShowInvoice(true)
  }

  const handleSendInvoice = () => {
    // This would be replaced with actual WhatsApp/Email sending
    alert("Invoice would be sent to customer via WhatsApp and Email")
  }

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Invoice Payment" text={`Invoice #${invoiceId}`}>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </DashboardHeader>

        {showInvoice ? (
          <InvoiceGenerator invoiceData={invoiceData} businessInfo={businessInfo} />
        ) : (
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <Card className="w-full">
              <CardHeader className="text-center">
                <CardTitle>
                  {paymentStatus === "pending" && "Awaiting Payment"}
                  {paymentStatus === "success" && "Payment Successful"}
                  {paymentStatus === "failed" && "Payment Failed"}
                </CardTitle>
                <CardDescription>
                  {paymentStatus === "pending" && `Scan the QR code to pay. Expires in ${countdown} seconds.`}
                  {paymentStatus === "success" && "The payment has been successfully processed."}
                  {paymentStatus === "failed" && "The payment could not be processed. Please try again."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                {paymentStatus === "pending" && (
                  <>
                    <div className="border p-4 rounded-md">
                      {/* <QRCode
                        value={`upi://pay?pa=example@upi&pn=ScanPOS&am=${invoiceData.total.toFixed(2)}&tr=${invoiceData.invoiceNumber}`}
                        size={200}
                        level="H"
                        includeMargin={true}
                      /> */}


                      <QRCodeCanvas
                        value={`upi://pay?pa=example@upi&pn=ScanPOS&am=${invoiceData.total.toFixed(2)}&tr=${invoiceData.invoiceNumber}`}
                        size={200}
                        level="H"
                      />


                    </div>
                    <p className="text-sm text-muted-foreground">Amount to pay: ₹{invoiceData.total.toFixed(2)}</p>
                  </>
                )}

                {paymentStatus === "success" && (
                  <div className="flex flex-col items-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <p>Thank you for your payment!</p>
                  </div>
                )}

                {paymentStatus === "failed" && (
                  <div className="flex flex-col items-center space-y-4">
                    <XCircle className="h-16 w-16 text-red-500" />
                    <p>Please try again or use a different payment method.</p>
                    <Button onClick={() => setPaymentStatus("pending")}>Try Again</Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {paymentStatus === "success" && (
                  <>
                    <Button className="w-full" onClick={handleDownloadInvoice}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Invoice
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleSendInvoice}>
                      <Send className="mr-2 h-4 w-4" />
                      Send to Customer
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </DashboardShell>
    </DashboardLayout>
  )
}

