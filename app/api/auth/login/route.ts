import { NextResponse } from "next/server"

// In a real application, this would connect to a database
// and use proper authentication with password hashing
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // For demo purposes, hardcoded credentials
    // In production, NEVER hardcode credentials like this
    if (username === "admin" && password === "password123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          name: "Admin User",
          role: "admin",
        },
      })
    }

    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

