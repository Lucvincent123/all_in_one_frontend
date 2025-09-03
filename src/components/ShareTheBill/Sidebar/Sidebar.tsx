import { useSearchParams, Link } from 'react-router-dom';
import type { Dispatch } from 'react';
import { memo } from 'react';

import styles from './Sidebar.module.css';

function Sidebar({
    mode,
    handleChange,
    content,
    setContent,
}: {
    mode: string;
    handleChange: () => void;
    content: string;
    setContent: Dispatch<string>;
}) {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    console.log('hello');
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.avatar} onClick={handleChange}></div>
                <div className={styles.info} style={{ display: mode === 'narrowed' ? 'none' : 'block' }}>
                    <h1 className={styles.username}>{username}</h1>
                    <h1 className={styles.id}>{`USER ID: ${userId}`}</h1>
                    <h1 className={styles.email}>{email}</h1>
                </div>
            </div>
            <div className={styles.content}>
                <ul className={styles.contentList} style={{ display: mode === 'narrowed' ? 'none' : 'block' }}>
                    <li
                        className={`${styles.contentItems} ${content === 'circles' ? styles.active : styles.inactive}`}
                        onClick={() => setContent('circles')}
                    >
                        All circles
                    </li>
                    <li
                        className={`${styles.contentItems} ${content === 'debts' ? styles.active : styles.inactive}`}
                        onClick={() => setContent('debts')}
                    >
                        All debts
                    </li>
                </ul>
            </div>
            <div className={styles.footer}>
                <Link className={styles.backLink} to='/'>
                    &#9668; {mode === 'narrowed' ? 'Home' : 'Back to home'}
                </Link>
            </div>
        </div>
    );
}

export default memo(Sidebar);
