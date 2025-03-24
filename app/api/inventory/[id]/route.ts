import { NextResponse } from "next/server"

// GET - Fetch a specific product
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real application, fetch from MongoDB
    // const { db } = await connectToDatabase()
    // const product = await db.collection("products").findOne({ _id: new ObjectId(id) })

    // Mock data for demonstration
    const products = [
      {
        id: "1",
        name: "Wireless Mouse",
        price: 1200,
        gst: 18,
        stock: 25,
        minStock: 10,
        barcode: "8901234567890",
        category: "Electronics",
      },
      {
        id: "2",
        name: "USB-C Cable",
        price: 450,
        gst: 18,
        stock: 5,
        minStock: 15,
        barcode: "8901234567891",
        category: "Electronics",
      },
      {
        id: "3",
        name: "Bluetooth Speaker",
        price: 2500,
        gst: 18,
        stock: 15,
        minStock: 5,
        barcode: "8901234567892",
        category: "Electronics",
      },
      {
        id: "4",
        name: "Laptop Bag",
        price: 1800,
        gst: 12,
        stock: 20,
        minStock: 8,
        barcode: "8901234567893",
        category: "Accessories",
      },
      {
        id: "5",
        name: "Wireless Keyboard",
        price: 1500,
        gst: 18,
        stock: 3,
        minStock: 10,
        barcode: "8901234567894",
        category: "Electronics",
      },
    ]

    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

// PUT - Update a product
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updates = await request.json()

    // In a real application, update in MongoDB
    // const { db } = await connectToDatabase()
    // await db.collection("products").updateOne(
    //   { _id: new ObjectId(id) },
    //   { $set: { ...updates, updatedAt: new Date() } }
    // )

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

// DELETE - Delete a product
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real application, delete from MongoDB
    // const { db } = await connectToDatabase()
    // await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

