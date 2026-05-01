import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { api } from '@/lib/api/api';
import { getServerApi } from '@/lib/api/serverApi';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: Props):
Promise<Metadata>  {
  const { slug } = await params;
  const tag = slug?.[0] || 'all';

  return {
    title: `Notes - ${tag}`,
    description: `Viewing notes filtered by ${tag}`,
    openGraph: {
      title: `Notes - ${tag}`,
      description: `Viewing notes filtered by ${tag}`,
      url: `https://notehub.app/notes/filter/${tag}`,
      images: [
        'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      ],
    },
  };
}

export default async function Page({
  params }: Props) {
  const { slug } = await params;

    const tag = slug?.[0];
    
  const queryClient = new QueryClient();

  const config = await getServerApi();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, tag],
    queryFn: async () => {
      const { data } = await api.get('/notes', {
        ...config,
        params: {
          page: 1,
          perPage: 12,
          ...(tag && tag !== 'all' ? { tag } : {}),
        },
      });
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}