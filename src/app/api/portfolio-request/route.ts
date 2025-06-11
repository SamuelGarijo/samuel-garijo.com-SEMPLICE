import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting
const requestAttempts = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3; // Max 3 requests per hour per email

function cleanupAttempts() {
  const now = Date.now();
  for (const [email, data] of requestAttempts.entries()) {
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
      requestAttempts.delete(email);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, message } = body;

    // Basic validation
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Clean up old attempts
    cleanupAttempts();

    // Check rate limiting
    const attemptData = requestAttempts.get(email);
    if (attemptData) {
      const now = Date.now();
      if (now - attemptData.firstAttempt < RATE_LIMIT_WINDOW && attemptData.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    // For now, we'll just log the request since we need to set up an email service
    // In production, you would send an actual email here
    console.log("Portfolio request received:", {
      name,
      email,
      message: message || "No message",
      timestamp: new Date().toISOString()
    });

    // Update rate limiting
    if (attemptData) {
      attemptData.count++;
    } else {
      requestAttempts.set(email, { count: 1, firstAttempt: Date.now() });
    }

    // TODO: Implement actual email sending here
    // Options:
    // 1. Use a service like SendGrid, Resend, or AWS SES
    // 2. Use a form submission service like Formspree or EmailJS
    // 3. Set up a webhook to notify you in Slack/Discord

    // For now, return success
    return NextResponse.json(
      { 
        success: true, 
        message: "Portfolio request received. You'll hear from Samuel soon!" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error processing portfolio request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}