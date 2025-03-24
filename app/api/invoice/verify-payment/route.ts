import { NextResponse } from "next/server"
import { verifyPayment } from "@/lib/razorpay"
import { sendWhatsAppMessage } from "@/lib/twilio"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { paymentId, orderId, signature, invoiceNumber } = await request.json()

    // Validate request
    if (!paymentId || !orderId || !signature || !invoiceNumber) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Verify payment
    const verification = await verifyPayment(paymentId, orderId, signature)

    if (!verification.success) {
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 })
    }

    // In a real application, update invoice status in MongoDB
    // const { db } = await connectToDatabase()
    // await db.collection("invoices").updateOne(
    //   { invoiceNumber },
    //   { $set: { status: "paid", paymentId, updatedAt: new Date() } }
    // )

    // Get invoice details (in a real app, from the database)
    const invoice = {
      invoiceNumber,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "9876543210",
      total: 2950,
    }

    // Generate PDF URL (in a real app, this would be a real URL)
    const pdfUrl = `https://example.com/invoices/${invoiceNumber}.pdf`

    // Send invoice via WhatsApp
    await sendWhatsAppMessage(
      invoice.customerPhone,
      `Thank you for your payment of ₹${invoice.total.toFixed(2)}. Your invoice ${invoice.invoiceNumber} is attached.`,
      pdfUrl,
    )

    // Send invoice via email if available
    if (invoice.customerEmail) {
      await sendEmail(
        invoice.customerEmail,
        `ScanPOS Invoice ${invoice.invoiceNumber}`,
        `Dear ${invoice.customerName},\n\nThank you for your payment of ₹${invoice.total.toFixed(2)}. Your invoice is attached.\n\nRegards,\nScanPOS Team`,
        pdfUrl,
      )
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and invoice sent",
    })
  } catch (error) {
    console.error("Payment verification failed:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

