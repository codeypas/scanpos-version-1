import { NextResponse } from "next/server"
import { createPayment } from "@/lib/razorpay"

export async function POST(request: Request) {
  try {
    const { customerName, customerEmail, customerPhone, items, subtotal, gst, total } = await request.json()

    // Validate request
    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`

    // Create invoice object
    const invoice = {
      invoiceNumber,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      gst,
      total,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // In a real application, save to MongoDB
    // const { db } = await connectToDatabase()
    // await db.collection("invoices").insertOne(invoice)

    // Create payment order
    const payment = await createPayment(total, invoiceNumber)

    if (!payment.success) {
      return NextResponse.json({ message: "Failed to create payment" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      invoice,
      payment: payment.order,
    })
  } catch (error) {
    console.error("Invoice generation failed:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

