export default function deleteCookie(field: string): void {
    document.cookie = `${field}=; path=/; max-age=0;`;
}
