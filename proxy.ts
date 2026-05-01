import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from './lib/api/serverApi';


export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const isAuthRoute = pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up');

    const isPrivateRoute = pathname.startsWith('/notes') ||
        pathname.startsWith('/profile');
    
    let isAuthenticated = false;

    try {
        const response = await checkSession();
        isAuthenticated = !!response.data;
    } catch {
        isAuthenticated = false;
    }


    if (!isAuthenticated && isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next()
}
