'use client';

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewProps {
    id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
    const router = useRouter();
    const { data, isLoading, error } =
        useQuery({
            queryKey: ['note', id],
            queryFn: () => fetchNoteById(id),
            refetchOnMount: false,
});
    const handleClose = () => {
        router.back();
    };

    
    

    return (
        <Modal onClose={handleClose}>
            <div className={css.container}>
             {isLoading &&  <p>Loading, please wait...</p>}
                {error || (!data && !isLoading) ? (
                    <p>Something went wrong.</p>
                ) : (
                    data && (
                        <div className={css.item}>
                            <div className={css.header}>
                                <h2>{data.title}</h2>
                                <button
                                    onClick={handleClose}
                                    className={css.closeButton}
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                            </div>
                            <p className={css.tag}>{data.tag}</p>
                            <p className={css.content}>{data.content}</p>
                            <p className={css.date}>{data.createdAt}</p>
                        </div>
                    )
                )}
                </div>
        </Modal>
    );
    }