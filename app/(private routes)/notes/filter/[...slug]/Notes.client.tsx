'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api/clientApi';
import Link from 'next/link';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';

import css from './NotesPage.module.css';

type Props = {
    tag?: string;
}

export default function NotesClient({ tag }: Props) {
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, 500);

    const activeTag = tag === 'all' ? '' : tag ?? '';

    const { data, isLoading, isError } = useQuery({
        queryKey: ['notes',  page, search , activeTag],
        queryFn: () => fetchNotes(page, search, activeTag),
        placeholderData: keepPreviousData,
    });

    const notes = data?.notes ?? [];
    const totalPages = data?.totalPages ?? 0;

    if (isLoading) return <p>Loading please wait...</p>;
    if (isError) return <p>Something went wrong</p>;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox
                    onChange={(value) => handleSearch(value)}
                />

                {totalPages > 1 && (
                    <Pagination
                        pageCount={totalPages}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                )}

                <Link href="/notes/action/create" className={css.button}
                >
                    Create note +
                </Link>
            </header>

            { notes.length > 0 && 
                <NoteList notes={notes}
                />
            }
        </div>
    );
}