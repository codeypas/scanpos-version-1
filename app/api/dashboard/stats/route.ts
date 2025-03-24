import { NextResponse } from "next/server"

// In a real application, this would fetch data from a database
export async function GET() {
  try {
    // Mock data for demonstration
    const stats = {
      totalSales: 125750,
      totalInvoices: 42,
      lowStockItems: 3,
      pendingPayments: 5,
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

