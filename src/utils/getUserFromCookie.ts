import getCookie from './getCookie';

type userInfo = {
    id: string;
    username: string;
    email: string;
};

export default function getUserFromCookie(): userInfo | null {
    const userCookie = getCookie('user-info');
    
    if (userCookie === '') return null;
    const [id, username, email] = userCookie.split('~');
    console.log(id);
    return { id, username, email };
}
