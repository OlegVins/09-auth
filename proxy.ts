import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from './lib/api/serverApi';


export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const isAuthRoute = pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up');

    const isPrivateRoute = pathname.startsWith('/notes') ||
        pathname.startsWith('/profile');
    
    let isAuthenticated = !!accessToken;
    let newTokens: { accessToken: string; refreshToken?: string } | null = null;

    if (!accessToken && refreshToken) {
        try {
            const authResponse = await checkSession();
            if (authResponse.status === 200 && authResponse.data) {
                isAuthenticated = true;
                newTokens = authResponse.data;
            }
        } catch {
            isAuthenticated = false;
        }
    }

    let response: NextResponse;

    if (!isAuthenticated && isPrivateRoute) {
        response = NextResponse.redirect(new URL('/sign-in', req.url));
    } else if (isAuthenticated && isAuthRoute) {
        response = NextResponse.redirect(new URL('/', req.url));
    } else {
        response = NextResponse.next();
    }
    

    if (newTokens) {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
        };

        if (newTokens.accessToken) {
            response.cookies.set('accessToken', newTokens.accessToken, cookieOptions);
        }
        if (newTokens.refreshToken) {
            response.cookies.set('refreshToken', newTokens.refreshToken, cookieOptions);
        }
    }
    return response;
}
