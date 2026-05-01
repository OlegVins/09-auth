import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api/api';
import { getServerApi } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'User profile page',
};

export default async function ProfilePage() {
    const config = await getServerApi();
    const { data: user } = await api.get('/users/me', {headers: config });

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link href="/profile/edit" className={css.editProfileButton}>
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