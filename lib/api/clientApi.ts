import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (
    page: number,
    search: string,
    tag?: string
): Promise<FetchNotesResponse> => {
    const res = await api.get('/notes', {
        params: {
            page,
            perPage: 12,
            search,
            ...(tag ? { tag } : {}),
        },
    });
    return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
    const res = await api.get(`/notes/${id}`);
    return res.data;
};

export const createNote = async (data: {
    title: string;
    content: string;
    tag: string;
}): Promise<Note> => {
    const res = await api.post('/notes', data);
    return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
    const res = await api.delete(`/notes/${id}`);
    return res.data;
};

export const register = async (data: {
    email: string;
    password: string;
}): Promise<User> => {
    const res = await api.post('/auth/register', data);
    return res.data;
};

export const login = async (data: {
    email: string;
    password: string;
}): Promise<User> => {
    const res = await api.post('/auth/login', data);
    return res.data;
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
    try {
        await api.get('/auth/session');
        return true;
    } catch {
        return false;
    }
};

export const getCurrentUser = async (): Promise<User> => {
    const res = await api.get('/users/me');
    return res.data;
};

export const updateMe = async (data: {
    username: string;
}): Promise<User> => {
    const res = await api.patch('/users/me', data);
    return res.data;
};