import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { phoneNumber, otp, businessName, businessAddress, gstNumber } = await request.json()

    // Validate request
    if (!phoneNumber || !otp) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Verify the OTP against what was sent
    // 2. Check if the phone number is already registered
    // 3. Store the user in a database
    // 4. Create a session or token

    // For demo purposes, we'll just return success if OTP is "123456"
    if (otp !== "123456") {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: "user_" + Date.now(),
        phoneNumber,
        businessName: businessName || null,
        businessAddress: businessAddress || null,
        gstNumber: gstNumber || null,
      },
    })
  } catch (error) {
    console.error("Phone registration failed:", error)
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}

