import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define public routes (no auth required)
  const publicRoutes = [
    '/admin/login',
    '/admin/register',
    '/api/auth',
  ]
  
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Check for admin routes (excluding public ones)
  const isAdminRoute = path.startsWith('/admin')
  
  if (isAdminRoute) {
    // Get the token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'your-secret-key' // Fallback for debugging
    })
    
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
    
    // Check if user has proper role
    const allowedRoles = ['ADMIN', 'EDITOR']
    if (!allowedRoles.includes(token.role as string)) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'Unauthorized')
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

// Make sure ALL admin routes are matched
export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
  ]
}