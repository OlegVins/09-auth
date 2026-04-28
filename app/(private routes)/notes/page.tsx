import NotesClient from "./filter/[...slug]/Notes.client";

type Props = {
    searchParams: Promise<{ tag?: string }>;
}

export default async function NotesPage({
    searchParams,
}: Props) {
    const resolvedSearchParams = await searchParams;
    const tag = resolvedSearchParams.tag;
    
    return (
        <>
            <NotesClient tag={tag} />;
            {
                
            }
        </>
    );
}