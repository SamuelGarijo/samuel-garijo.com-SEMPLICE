import { protectedRoutes } from "@/app/resources";

export function validateEnvironmentVariables() {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Only require password if there are protected routes
  const hasProtectedRoutes = Object.values(protectedRoutes).some(isProtected => isProtected);
  
  if (hasProtectedRoutes && !process.env.PAGE_ACCESS_PASSWORD) {
    errors.push('Missing required environment variable: PAGE_ACCESS_PASSWORD (required when protected routes are configured)');
  }

  // Validate password strength (optional but recommended)
  const password = process.env.PAGE_ACCESS_PASSWORD;
  if (password) {
    if (password.length < 8) {
      warnings.push('PAGE_ACCESS_PASSWORD should be at least 8 characters long for better security');
    }
    if (!/[A-Z]/.test(password)) {
      warnings.push('PAGE_ACCESS_PASSWORD should contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      warnings.push('PAGE_ACCESS_PASSWORD should contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      warnings.push('PAGE_ACCESS_PASSWORD should contain at least one special character');
    }
  }

  // Validate session duration if set
  const sessionDuration = process.env.SESSION_DURATION_HOURS;
  if (sessionDuration) {
    const duration = parseInt(sessionDuration);
    if (isNaN(duration) || duration <= 0) {
      errors.push('SESSION_DURATION_HOURS must be a positive number');
    }
  }

  // Log warnings in development
  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.warn('\n⚠️  Security warnings:');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
    console.warn('\n');
  }

  // Throw error if required variables are missing
  if (errors.length > 0) {
    console.error('\n❌ Environment validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('\n');
    throw new Error('Environment validation failed. Please check your environment variables.');
  }

  console.log('✅ Environment variables validated successfully');
}