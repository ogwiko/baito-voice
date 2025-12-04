import Home from '../page';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    return <Home searchParams={searchParams} />;
}
