import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getNoteById } from '@/lib/api/serverApi';
import ModalWrapper from './ModalWrapper';
import NotePreview from './NotePreview.client';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ModalNotePage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  try {
     await queryClient.prefetchQuery({
    queryKey: ['note', id ],
    queryFn: () => getNoteById(id),
  });
  } catch (e) {
    console.error('Prefetch error:', e);
  }

  return (
      <HydrationBoundary state={dehydrate(queryClient)}>
          <ModalWrapper>
              <NotePreview id={id} /> 
          </ModalWrapper>   
    </HydrationBoundary>
  );
}