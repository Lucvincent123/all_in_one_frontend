import { useState, memo } from 'react';
import type { FormEvent } from 'react';
import styles from './CreateCircle.module.css';

import Loading from '../../Loading/Loading';
import { getCookie } from '../../../utils';
import { useSearchParams } from 'react-router-dom';

function CreateCircle({
    setIsCreating,
    refresh,
    setRefresh,
}: {
    setIsCreating: (value: boolean) => void;
    refresh: boolean;
    setRefresh: (value: boolean) => void;
}) {
    const [title, setTitle] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');

    const createCircle = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const token = getCookie('token');
            if (token === '') throw new Error('Unauthorized: no token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/circle`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                }),
            });
            if (!response.ok) throw new Error('Failed to create circle');
            const json = await response.json();
            if (!json.success) throw new Error(json.message);
            const response1 = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/circle-member`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    circleId: json.payload,
                }),
            });
            if (!response1.ok) throw new Error('Failed to create circle member');
            const json1 = await response1.json();
            if (!json1.success) throw new Error(json1.message);
            setLoading(false);
            setRefresh(!refresh);
            setIsCreating(false);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                setError(error.message);
            }
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={createCircle}>
                <h1 className={styles.title}>Create a circle</h1>
                <div className={styles.formGroup}>
                    <input
                        type='text'
                        id='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                        placeholder=' '
                        required
                    />
                    <label className={styles.label} htmlFor='title'>
                        Circle name
                    </label>
                </div>
                <div className={styles.buttonGroup}>
                    <button className={`${styles.submit} ${styles.button}`} type='submit'>
                        Create
                    </button>
                    <button
                        className={`${styles.cancel} ${styles.button}`}
                        type='button'
                        onClick={() => setIsCreating(false)}
                    >
                        Cancel
                    </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
            </form>
            {loading && <Loading />}
        </div>
    );
}

export default memo(CreateCircle);
