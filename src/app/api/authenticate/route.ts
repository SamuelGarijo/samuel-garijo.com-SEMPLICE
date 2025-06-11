import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import crypto from "crypto";

// Simple in-memory rate limiting
const attempts = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Simple in-memory session store (consider using Redis or a database in production)
const sessions = new Map<string, { createdAt: number; expiresAt: number }>();

function cleanupAttempts() {
  const now = Date.now();
  for (const [ip, data] of attempts.entries()) {
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
      attempts.delete(ip);
    }
  }
}

function cleanupSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}

function getClientIp(request: NextRequest): string {
  // Try to get the real IP from various headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a default value if no IP can be determined
  return "unknown";
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  
  // Clean up old attempts and sessions periodically
  cleanupAttempts();
  cleanupSessions();
  
  // Check rate limiting
  const attemptData = attempts.get(clientIp);
  if (attemptData) {
    const now = Date.now();
    if (now - attemptData.firstAttempt < RATE_LIMIT_WINDOW && attemptData.count >= MAX_ATTEMPTS) {
      const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - attemptData.firstAttempt)) / 1000 / 60);
      return NextResponse.json(
        { message: `Too many attempts. Please try again in ${remainingTime} minutes.` },
        { status: 429 }
      );
    }
  }
  
  const body = await request.json();
  const { password } = body;
  const correctPassword = process.env.PAGE_ACCESS_PASSWORD;

  if (!correctPassword) {
    console.error('PAGE_ACCESS_PASSWORD environment variable is not set');
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }

  if (password === correctPassword) {
    // Generate a unique session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const sessionDuration = parseInt(process.env.SESSION_DURATION_HOURS || "24") * 60 * 60 * 1000;
    
    // Store session
    sessions.set(sessionToken, {
      createdAt: now,
      expiresAt: now + sessionDuration
    });
    
    // Clear failed attempts on successful login
    attempts.delete(clientIp);
    
    const response = NextResponse.json({ success: true }, { status: 200 });
    
    response.headers.set(
      "Set-Cookie",
      cookie.serialize("authToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: sessionDuration / 1000, // Convert to seconds
        sameSite: "strict",
        path: "/",
      })
    );

    return response;
  } else {
    // Track failed attempt
    const now = Date.now();
    const attemptData = attempts.get(clientIp);
    
    if (attemptData) {
      attemptData.count++;
    } else {
      attempts.set(clientIp, { count: 1, firstAttempt: now });
    }
    
    return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
  }
}

// Export the sessions for use in check-auth route
export { sessions };