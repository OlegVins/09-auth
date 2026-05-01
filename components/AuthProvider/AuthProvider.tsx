'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkSession, getCurrentUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
    children,
}: {
        children: React.ReactNode;
    }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const setUser = useAuthStore((s) => s.setUser);
    const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

    useEffect(() => {
        async function verify() {
            try {
                const isAuthenticated = await checkSession();

                if (isAuthenticated) {
                    const user = await getCurrentUser();
                    setUser(user);
                } else {
                    handleAuthFailure();
                }
                } catch {
                handleAuthFailure();
            } finally {
                setIsLoading(false);
            }
        }

        function handleAuthFailure() {
            clearIsAuthenticated();
            if (pathname.startsWith('/notes') || pathname.startsWith('/profile')) {
                        router.push('/sign-in');
                    }
                }
         
                verify();
    }, [pathname, router, setUser, clearIsAuthenticated]);
    
    if (isLoading) return <p>Loading...</p>;

    return <>{children}</>;
    
        }