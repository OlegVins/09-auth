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

export const getCurrentUser = async (): Promise<User> => {
    const serverApi = await getServerApi();
    const { data } = await serverApi.get<User>('/auth/me');
    return data;
};

export const getNoteById = async (id: string): Promise<Note> => {
    const serverApi = await getServerApi();
    const { data } = await serverApi.get<Note>(`/notes/${id}`);
    return data;
};

export const checkSession = async (): Promise<boolean> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (accessToken) return true;

    if (refreshToken) {
        try {
            await refreshSession(refreshToken);
            return true;
        } catch  {
            return false;
        }
    }
    return false;
};