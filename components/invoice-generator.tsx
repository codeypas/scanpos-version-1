"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { jsPDF } from "jspdf"
import QRCode from "qrcode"
import { Download, Share } from "lucide-react"

interface InvoiceGeneratorProps {
  invoiceData: {
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
    date: string
  }
  businessInfo: {
    name: string
    address: string
    phone: string
    email: string
    gst?: string
    logo?: string
  }
}

export function InvoiceGenerator({ invoiceData, businessInfo }: InvoiceGeneratorProps) {
  // Load business settings from localStorage
  const [loadedBusinessInfo, setLoadedBusinessInfo] = useState(businessInfo)

  useEffect(() => {
    const storedSettings = localStorage.getItem("business-settings")
    if (storedSettings) {
      const settings = JSON.parse(storedSettings)
      setLoadedBusinessInfo({
        name: settings.businessName || businessInfo.name,
        address: settings.businessAddress || businessInfo.address,
        phone: settings.businessPhone || businessInfo.phone,
        email: settings.businessEmail || businessInfo.email,
        gst: settings.businessGST || businessInfo.gst,
        logo: settings.businessLogo || businessInfo.logo,
      })
    }
  }, [])

  const [isGenerating, setIsGenerating] = useState(false)
  const qrCodeRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = async () => {
    if (!qrCodeRef.current) return

    const qrData = JSON.stringify({
      invoiceNumber: invoiceData.invoiceNumber,
      amount: invoiceData.total,
      date: invoiceData.date,
      business: loadedBusinessInfo.name,
    })

    await QRCode.toCanvas(qrCodeRef.current, qrData, {
      width: 100,
      margin: 1,
    })
  }


  // Add this at the top of the component
const [isClient, setIsClient] = useState(false)

useEffect(() => {
  setIsClient(true)
}, [])

// Then wrap your QR code and other dynamic content
{isClient && (
  <canvas ref={qrCodeRef} className="mt-2 ml-auto" width={100} height={100} />
)}



  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Generate QR code first
      await generateQRCode()

      // Create PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add business logo if available
      if (loadedBusinessInfo.logo) {
        doc.addImage(loadedBusinessInfo.logo, "JPEG", 10, 10, 50, 20)
      }

      // Add business info
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text(loadedBusinessInfo.name, 10, loadedBusinessInfo.logo ? 40 : 20)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(loadedBusinessInfo.address, 10, loadedBusinessInfo.logo ? 45 : 25)
      doc.text(`Phone: ${loadedBusinessInfo.phone}`, 10, loadedBusinessInfo.logo ? 50 : 30)
      doc.text(`Email: ${loadedBusinessInfo.email}`, 10, loadedBusinessInfo.logo ? 55 : 35)

      if (loadedBusinessInfo.gst) {
        doc.text(`GST: ${loadedBusinessInfo.gst}`, 10, loadedBusinessInfo.logo ? 60 : 40)
      }

      // Add invoice details
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`INVOICE #${invoiceData.invoiceNumber}`, 10, loadedBusinessInfo.logo ? 70 : 50)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Date: ${invoiceData.date}`, 10, loadedBusinessInfo.logo ? 75 : 55)

      // Add customer info
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Bill To:", 10, loadedBusinessInfo.logo ? 85 : 65)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(invoiceData.customerName, 10, loadedBusinessInfo.logo ? 90 : 70)
      doc.text(`Phone: ${invoiceData.customerPhone}`, 10, loadedBusinessInfo.logo ? 95 : 75)

      if (invoiceData.customerEmail) {
        doc.text(`Email: ${invoiceData.customerEmail}`, 10, loadedBusinessInfo.logo ? 100 : 80)
      }

      // Add QR code if available
      if (qrCodeRef.current) {
        const qrCodeDataURL = qrCodeRef.current.toDataURL("image/png")
        doc.addImage(qrCodeDataURL, "PNG", 150, 10, 40, 40)
      }

      // Add items table
      const startY = loadedBusinessInfo.logo ? 110 : 90
      doc.setFontSize(10)

      // Table headers
      doc.setFont("helvetica", "bold")
      doc.text("Item", 10, startY)
      doc.text("Price", 100, startY)
      doc.text("Qty", 130, startY)
      doc.text("GST", 150, startY)
      doc.text("Total", 180, startY)

      // Table rows
      doc.setFont("helvetica", "normal")
      let y = startY + 10

      invoiceData.items.forEach((item) => {
        const itemTotal = item.price * item.quantity
        const itemGST = (itemTotal * item.gst) / 100
        const itemTotalWithGST = itemTotal + itemGST

        doc.text(item.name, 10, y)
        doc.text(`₹${item.price.toFixed(2)}`, 100, y)
        doc.text(item.quantity.toString(), 130, y)
        doc.text(`${item.gst}%`, 150, y)
        doc.text(`₹${itemTotalWithGST.toFixed(2)}`, 180, y)

        y += 10
      })

      // Add line
      doc.line(10, y, 200, y)
      y += 10

      // Add totals
      doc.text("Subtotal:", 130, y)
      doc.text(`₹${invoiceData.subtotal.toFixed(2)}`, 180, y)
      y += 10

      doc.text("GST:", 130, y)
      doc.text(`₹${invoiceData.gst.toFixed(2)}`, 180, y)
      y += 10

      doc.setFont("helvetica", "bold")
      doc.text("Total:", 130, y)
      doc.text(`₹${invoiceData.total.toFixed(2)}`, 180, y)

      // Add footer
      y += 30
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      doc.text("Thank you for your business!", 10, y)

      // Save the PDF
      doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate invoice. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const shareInvoice = async () => {
    try {
      // Generate QR code first
      await generateQRCode()

      // Create PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add content (same as generatePDF)
      // ...

      // Get PDF as blob
      const pdfBlob = doc.output("blob")

      // Share the PDF
      if (navigator.share) {
        await navigator.share({
          title: `Invoice #${invoiceData.invoiceNumber}`,
          text: `Invoice for ${invoiceData.customerName}`,
          files: [new File([pdfBlob], `Invoice-${invoiceData.invoiceNumber}.pdf`, { type: "application/pdf" })],
        })
      } else {
        // Fallback if Web Share API is not available
        const pdfUrl = URL.createObjectURL(pdfBlob)
        window.open(pdfUrl, "_blank")
      }
    } catch (error) {
      console.error("Error sharing invoice:", error)
      alert("Failed to share invoice. Please try downloading instead.")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{loadedBusinessInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{loadedBusinessInfo.address}</p>
            <p className="text-sm text-muted-foreground">Phone: {loadedBusinessInfo.phone}</p>
            <p className="text-sm text-muted-foreground">Email: {loadedBusinessInfo.email}</p>
            {loadedBusinessInfo.gst && <p className="text-sm text-muted-foreground">GST: {loadedBusinessInfo.gst}</p>}
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold">INVOICE #{invoiceData.invoiceNumber}</h3>
            <p className="text-sm text-muted-foreground">Date: {invoiceData.date}</p>
            <canvas ref={qrCodeRef} className="mt-2 ml-auto" width={100} height={100} />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
          <p>{invoiceData.customerName}</p>
          <p>Phone: {invoiceData.customerPhone}</p>
          {invoiceData.customerEmail && <p>Email: {invoiceData.customerEmail}</p>}
        </div>

        <div className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.items.map((item, index) => {
                const itemTotal = item.price * item.quantity
                const itemGST = (itemTotal * item.gst) / 100
                const itemTotalWithGST = itemTotal + itemGST

                return (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.gst}%</TableCell>
                    <TableCell className="text-right">₹{itemTotalWithGST.toFixed(2)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{invoiceData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>GST:</span>
              <span>₹{invoiceData.gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>₹{invoiceData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={shareInvoice}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

