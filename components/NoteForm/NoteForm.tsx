'use client';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';
import { createNote } from '@/lib/api/clientApi';
import { useQueryClient } from '@tanstack/react-query';
import { NoteTag } from '@/types/note';


export default function NoteForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { draft, setDraft, clearDraft } = useNoteStore();

    async function handleSubmit(formData: FormData) {
        const newNote = {
            title: String(formData.get('title')),
            content: String(formData.get('content')),
            tag: formData.get('tag') as NoteTag,
        };

        await createNote(newNote);

        queryClient.invalidateQueries({
            queryKey: ['notes'],
            exact: false,
        });

        clearDraft();
        router.push('/notes');
    }

    return (
        <form action={handleSubmit}
            className={css.form}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                    value={draft.title}
                    onChange={(e) =>
                        setDraft({ ...draft, title: e.target.value })
                    }
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    value={draft.content}
                    onChange={(e) =>
                        setDraft({ ...draft, content: e.target.value })
                    }
                />
            </div>
            
            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    value={draft.tag}
                    onChange={(e) =>
                        setDraft({ ...draft, tag: e.target.value })
                    }
                >
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </select>
            </div>
            
            <div className={css.actions}>
                <button
                    type="button"
                    className={css.cancelButton}
                    onClick={() => router.back()}
                >
                    Cancel
                </button>
                    
                <button
                    type="submit"
                    className={css.submitButton}
                >
                    Create note
                </button>
            </div>
        </form>
    );
}
