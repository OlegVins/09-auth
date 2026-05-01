import { cookies } from "next/headers";
import { api } from './api';
import { User } from '../../types/user';
import { Note } from '../../types/note';
import { AxiosResponse } from "axios";

export const getServerApi = async () => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

    return { Cookie: cookieHeader };      
    };

export const getCurrentUser = async (): Promise<User | null> => {
    try {
    const headers = await getServerApi();
    const { data } = await api.get<User>('/users/me', { headers });
        return data;
    } catch {
        return null;
    }
};

export const getNoteById = async (id: string): Promise<Note> => {
    const headers = await getServerApi();
    const { data } = await api.get<Note>(`/notes/${id}`, { headers });
    return data;
};

export const checkSession = async (): Promise<AxiosResponse> => {
        const headers = await getServerApi();
        return await api.get('/auth/session', { headers });
};
