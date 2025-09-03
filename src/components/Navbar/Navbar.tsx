import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { auth, getUserFromCookie, deleteCookie } from '../../utils';

import styles from './Navbar.module.css';

import CaretDown from '../../assets/icons/caret_down.svg';
import CaretUp from '../../assets/icons/caret_up.svg';
import Logout from '../../assets/icons/logout.svg';

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const toggleShowUserInfo = () => {
        setShowUserInfo(!showUserInfo);
    };

    const deleteToken = () => {
        deleteCookie('token');
        deleteCookie('user-info');
        setRefresh(!refresh);
    };

    useEffect(() => {
        const getUserInfo = async () => {
            const isAuth = await auth();
            console.log(isAuth);
            console.log('hello');
            setIsAuthenticated(isAuth);

            if (isAuth) {
                const userInfo = getUserFromCookie();
                console.log(userInfo);
                setId(userInfo?.id as string);
                setUsername(userInfo?.username as string);
                setEmail(userInfo?.email as string);
            }
        };
        getUserInfo();
    }, [isAuthenticated, refresh]);

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navbar_list}>
                <li className={styles.navbar_item}>
                    <Link className={styles.navbar_link} to='/'>
                        Home
                    </Link>
                </li>
                <li className={styles.navbar_item}>
                    <Link className={styles.navbar_link} to='/about'>
                        About
                    </Link>
                </li>
                <li className={styles.navbar_item}>
                    <Link className={styles.navbar_link} to='/contact'>
                        Contact
                    </Link>
                </li>

                <li className={styles.navbar_item}>
                    <div className={`${styles.navbar_link} ${styles.navbar_dropdown}`}>
                        More
                        <img src={CaretDown} alt='caret-down' />
                        <ul className={styles.navbar_dropdown_menu}>
                            <li className={styles.navbar_dropdown_item}>
                                <Link className={styles.navbar_dropdown_link} to='/services'>
                                    Services
                                </Link>
                            </li>
                            <li className={styles.navbar_dropdown_item}>
                                <Link className={styles.navbar_dropdown_link} to='/blog'>
                                    Blog
                                </Link>
                            </li>
                            <li className={styles.navbar_dropdown_item}>
                                <Link className={styles.navbar_dropdown_link} to='/faq'>
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>

            {isAuthenticated && (
                <div className={styles.userMenu}>
                    <div className={styles.userNavbar} onClick={toggleShowUserInfo}>
                        <div className={styles.avatar}></div>
                        <h1 className={styles.username}>{`Welcome ${username}`}</h1>
                        {showUserInfo ? (
                            <img src={CaretUp} alt='caret-up' className={styles.caret} />
                        ) : (
                            <img src={CaretDown} alt='caret-down' className={styles.caret} />
                        )}
                    </div>
                    {showUserInfo && (
                        <div className={styles.userInfo}>
                            <p className={`${styles.userInfoItems} ${styles.userId}`}>{`ID: ${id}`}</p>
                            <p className={`${styles.userInfoItems} ${styles.email}`}>{email}</p>
                            <div className={`${styles.userInfoItems} ${styles.signout}`} onClick={deleteToken}>
                                <img src={Logout} alt='logout' />
                                Sign out
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isAuthenticated || (
                <ul className={styles.navbar_list}>
                    <li className={styles.navbar_item}>
                        <Link className={styles.navbar_link} to='/login'>
                            Login
                        </Link>
                    </li>
                    <li className={styles.navbar_item}>
                        <Link className={styles.navbar_link} to='/register'>
                            Register
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    );
}
