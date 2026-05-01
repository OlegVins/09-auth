import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from './lib/api/serverApi';


export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const accessToken = req.cookies.get('accessToken')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;

    const isAuthRoute = pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up');

    const isPrivateRoute = pathname.startsWith('/notes') ||
        pathname.startsWith('/profile');
    
    let isAuthenticated = !!accessToken;
    const response = NextResponse.next();

    if (!accessToken && refreshToken) {
        try {
            const authResponse = await checkSession();
            if (authResponse.status === 200 && authResponse.data) {
                isAuthenticated = true;

                const newAccessToken = authResponse.data.accessToken;
                if (newAccessToken) {
                    response.cookies.set('accessToken', newAccessToken, { httpOnly: true });
                }
            }
        } catch {
            isAuthenticated = false;
        }
    }

    if (!isAuthenticated && isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next()
}
