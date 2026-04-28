'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
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
                const user = await checkSession();

                if (user) {
                    setUser(user);
                } else {
                    clearIsAuthenticated();

                    if (pathname.startsWith('/notes') || pathname.startsWith('/profile')) {
                        router.push('/sign-in');
                    }
                }
            } catch {
                clearIsAuthenticated();
                router.push('/sign-in');
            } finally {
                setIsLoading(false);
            }
        }
                verify();
    }, [pathname, router, setUser, clearIsAuthenticated]);
    
    if (isLoading) return <p>Loading...</p>;

    return <>{children}</>;
    
        }