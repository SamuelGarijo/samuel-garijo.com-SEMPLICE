import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import { getSession, deleteSession, isSessionValid } from "../sessions";

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookie.parse(cookieHeader);
  const token = cookies.authToken;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Check if session exists and is valid
  if (isSessionValid(token)) {
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } else {
    // Clean up expired session
    const session = getSession(token);
    if (session) {
      deleteSession(token);
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}