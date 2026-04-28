import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get('token');
    const isAuthRoute = req.nextUrl.pathname.startsWith('/sign-in')
        ||
        req.nextUrl.pathname.startsWith('/sign-up');
    const isPrivateRoute = req.nextUrl.pathname.startsWith('/notes') ||
        req.nextUrl.pathname.startsWith('/profile');
    
    if (!token && isPrivateRoute) {
        return NextResponse.redirect(new URL('sing-in', req.url));
    }
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/profile', req.url));
    }
    return NextResponse.next()
}