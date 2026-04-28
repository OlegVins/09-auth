'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import css from './ProfilePage.module.css';
import Image from 'next/image';

export default function ProfilePage() {
    const user = useAuthStore((s) => s.user);

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link href="" className={css.editProfileButton}>
                        Edit Profile
                    </Link>
                </div>
                
                <div className={css.avatarWrapper}>
                    <Image
                        src={user?.avatar || '/avatar.png'}
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                    />
                </div>
                
                <div className={css.profileInfo}>
                    <p>
                        Username: {user?.username || 'no username'}
                    </p>
                    <p>
                        Email: {user?.email}
                    </p>
                </div>
            </div>
        </main>

    );
}