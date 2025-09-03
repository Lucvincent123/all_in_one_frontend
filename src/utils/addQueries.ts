import type { Location } from 'react-router-dom';

export default function addQueries(location: Location, queries: Record<string, string | number | null | undefined>) {
    const params = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(queries)) {
        if (value == null) {
            params.delete(key);
        } else {
            params.set(key, String(value));
        }
    }
    return `${location.pathname}?${params.toString()}${location.hash}`;
}
