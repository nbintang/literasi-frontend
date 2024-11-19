import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;
  const isPublicPath = path === '/login' || path === '/register';

  if (token) {
    try {
      // Use jose instead of jsonwebtoken
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jose.jwtVerify(token, secret);

      // If user is logged in and tries to access login/register,
      // redirect them back to dashboard
      if (isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Allow access to dashboard and other protected routes
      return NextResponse.next();
    } catch (error) {
      console.log('Invalid token:', error);
      const response = NextResponse.next();
      response.cookies.delete('token');

      if (!isPublicPath) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return response;
    }
  }

  // No token cases
  if (!isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};