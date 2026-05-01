import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { getNoteById } from '@/lib/api/serverApi';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const note = await getNoteById(id);

  return {
    title: note.title,
    description: note.content,
    openGraph: {
      title: note.title,
      description: note.content,
      url: `https://notehub.app/notes/${id}`,
      images: [
        {
          url:
            'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: {
    params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id ],
    queryFn: () => getNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}