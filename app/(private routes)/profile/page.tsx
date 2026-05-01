import type { Metadata } from 'next';
import Link from 'next/link';
import css from './ProfilePage.module.css';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/api/serverApi';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'User profile page',
};

export default async function ProfilePage() {
    const user = await getCurrentUser();
    
    if (!user) {
        return <div className={css.mainContent}>User not found</div>;
    }

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
                        priority
                    />
                </div>
                
                <div className={css.profileInfo}>
                    <p>
                        <strong>Username:</strong> {user?.username || 'no username'}
                    </p>
                    <p>
                       <strong>Email:</strong> {user?.email}
                    </p>
                </div>
            </div>
        </main>

    );
}