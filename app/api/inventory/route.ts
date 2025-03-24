import { NextResponse } from "next/server"

// GET - Fetch all products
export async function GET() {
  try {
    // In a real application, fetch from MongoDB
    // const { db } = await connectToDatabase()
    // const products = await db.collection("products").find({}).toArray()

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

    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

// POST - Add a new product
export async function POST(request: Request) {
  try {
    const product = await request.json()

    // Validate request
    if (!product.name || !product.price || !product.gst || !product.stock || !product.minStock) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Generate barcode if not provided
    if (!product.barcode) {
      product.barcode = Math.floor(Math.random() * 10000000000000)
        .toString()
        .padStart(13, "0")
    }

    // In a real application, save to MongoDB
    // const { db } = await connectToDatabase()
    // const result = await db.collection("products").insertOne(product)
    // product.id = result.insertedId

    // Mock response
    product.id = Date.now().toString()

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Failed to add product:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

