import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import { sessions } from "../authenticate/route";

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookie.parse(cookieHeader);
  const token = cookies.authToken;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Check if session exists and is valid
  const session = sessions.get(token);
  if (session && Date.now() < session.expiresAt) {
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } else {
    // Clean up expired session
    if (session) {
      sessions.delete(token);
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}