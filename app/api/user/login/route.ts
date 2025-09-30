import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Make the login API call to get JWT token
    const response = await fetch(`${process.env.AI_API_BASE_URL || "https://your-api-domain.com"}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Login failed: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Login API Error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
