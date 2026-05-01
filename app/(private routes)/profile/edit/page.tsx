'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useAuthStore } from "@/lib/store/authStore";
import { updateMe, getCurrentUser } from "@/lib/api/clientApi";
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const [username, setUsername] = useState(user?.username || '');

    useEffect(() => {
        if (!user) {
            getCurrentUser().then((data) => {
                setUser(data);
                setUsername(data.username);
            });
        }
    }, [user, setUser]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const updatedUser = await updateMe({ username });

        setUser(updatedUser);
        router.push('./profile');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>

                <Image
                    src={user?.avatar || '/avatar.png'}
                    alt="User Avatar"
                    width={120}
                    height={120}
                    className={css.avatar}
                />

                <form className={css.profileInfo}
                    onSubmit={handleSubmit}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username:</label>
                        <input id="username"
                            type="text"
                            className={css.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <p>Email: {user?.email}</p>

                    <div className={css.actions}>
                        <button type="submit" className={css.saveButton}>
                            Save
                        </button>
                        <button type="button" className={css.cancelButton}
                            onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}