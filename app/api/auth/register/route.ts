import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName, businessAddress, gstNumber } = await request.json()

    // Validate request
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Check if the email is already registered
    // 2. Hash the password
    // 3. Store the user in a database
    // 4. Create a session or token

    // For demo purposes, we'll just return success
    return NextResponse.json({
      success: true,
      user: {
        id: "user_" + Date.now(),
        name,
        email,
        businessName: businessName || null,
        businessAddress: businessAddress || null,
        gstNumber: gstNumber || null,
      },
    })
  } catch (error) {
    console.error("Registration failed:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

