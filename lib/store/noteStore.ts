import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialDraft = {
    title: '',
    content: '',
    tag: 'Todo',
};

type NoteDraft = typeof initialDraft;

interface NoteStore {
    draft: NoteDraft;
    setDraft: (note: NoteDraft) => void;
    clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note) => set({ draft: note }),
            clearDraft: () => set({ draft: initialDraft }),
        }),
        {
            name: 'note-draft',
        }
    )
);