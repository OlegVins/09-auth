'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from '@/lib/api/clientApi';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const user = useAuthStore((s) => s.user);
    const claerIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

    const handleLogout = async () => {
        await logout();
        claerIsAuthenticated();
        router.push('/sign-in');
    };

    if (isAuthenticated) {
        return (
            <>
                <li className={css.navigationItem}>
                    <Link href="/profile" prefetch={false} className={css.navigationLink}>
                        Profile
                    </Link>
                </li>

                <li className={css.navigationItem}>
                    <p className={css.userEmail}>{user?.email}</p>
                    <button className={css.logoutButton}
                        onClick={handleLogout}>
                        Logout
                    </button>
                </li>
            </>
        );
    }

    return (
        <>
        <li className={css.navigationItem}>
  <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
    Login
  </Link>
</li>

<li className={css.navigationItem}>
  <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
    Sign up
  </Link>
</li>
</>
    );
}


  