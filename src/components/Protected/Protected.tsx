import { useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { auth, addQueries, getUserFromCookie } from '../../utils';

export default function Protected({ children }: { children: ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const check = async () => {
            const isAuthenticated = await auth();
            if (!isAuthenticated) {
                navigate(`/login?entry=${location.pathname}`, { replace: true });
                return;
            }

            const userInfo = getUserFromCookie();
            if (userInfo) {
                const newUrl = addQueries(location, {
                    userId: userInfo.id,
                    username: userInfo.username,
                    email: userInfo.email,
                });

                navigate(newUrl, { replace: true });
            }
        };
        check();
    }, []);

    return children;
}
