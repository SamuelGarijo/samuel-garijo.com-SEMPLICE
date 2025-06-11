import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import { sessions } from "../authenticate/route";

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookie.parse(cookieHeader);
  const token = cookies.authToken;

  // Remove session from memory if it exists
  if (token && sessions.has(token)) {
    sessions.delete(token);
  }

  // Clear the auth cookie
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  response.headers.set(
    "Set-Cookie",
    cookie.serialize("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      sameSite: "strict",
      path: "/",
    })
  );

  return response;
}