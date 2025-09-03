import getCookie from './getCookie';
import deleteCookie from './deleteCookie';

export default async function auth(): Promise<boolean> {
    const tokenCookie = getCookie('token');
    if (tokenCookie === '') {
        deleteCookie('user-info');
        return false;
    }
    const userCookie = getCookie('user-info');
    if (userCookie !== '') return true;
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/authenticate`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${tokenCookie}`,
            },
        });

        if (!response.ok) return false;
        console.log('hello1');
        const json = await response.json();
        if (!json.success) return false;
        document.cookie = `user-info=${json.payload.id}~${json.payload.username}~${json.payload.email}; path=/; max-age=1800`;
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
