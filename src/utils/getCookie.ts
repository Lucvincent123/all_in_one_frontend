export default function getCookie(field: string): string {
    const cookieString = document.cookie.split('; ').find((row) => row.startsWith(`${field}=`));
    if (cookieString === undefined) return '';
    const cookie = cookieString.split('=')[1];
    return cookie;
}


