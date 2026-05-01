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
                const newRefreshToken = authResponse.data.refreshToken;
                if (newRefreshToken) {
                    response.cookies.set('refreshToken', newRefreshToken, { httpOnly: true });
                }
            }
        } catch {
            isAuthenticated = false;
        }
    }

    if (!isAuthenticated && isPrivateRoute) {
        const redirectResponse = NextResponse.redirect(new URL('/sign-in', req.url));
        response.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
    }

    if (isAuthenticated && isAuthRoute) {
        const redirectResponse = NextResponse.redirect(new URL('/', req.url));
         response.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
    }

    return response;
}
