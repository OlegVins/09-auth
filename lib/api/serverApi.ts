import { cookies } from "next/headers";
import { api } from './api';
import { User } from '../../types/user';
import { Note } from '../../types/note';
import { AxiosInstance } from "axios";

export const getServerApi = async (): Promise<AxiosInstance> => {
    const cookieStore = await cookies();
    api.defaults.headers.common['Cookie'] = cookieStore.toString();
    return api;
};

export const refreshSession = async (refreshToken: string) => {
    const serverApi = await getServerApi();
    const { data } = await serverApi.post('/auth/refresh', {}, {
        headers: {
            Cookie: `refreshToken=${refreshToken}`,
        }
    });
    return data;
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
    const serverApi = await getServerApi();
    const { data } = await serverApi.get<User>('/users/me');
        return data;
    } catch {
        return null;
    }
};

export const getNoteById = async (id: string): Promise<Note> => {
    const serverApi = await getServerApi();
    const { data } = await serverApi.get<Note>(`/notes/${id}`);
    return data;
};

export const checkSession = async (): Promise<boolean> => {
    try {
        const serverApi = await getServerApi();
        const res = await serverApi.get('/auth/session');

        return !!res.data;
    } catch {
        return false;
    }
};
