import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

import styles from './AllCircles.module.css';

import Circle from '../Circle/Circle';
import CreateCircle from '../CreateCircle/CreateCircle';
import Loading from '../../Loading/Loading';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { getCookie } from '../../../utils';

type Circle = {
    circleid: string;
    title: string;
    balance: number;
};

export default function AllCircles() {
    const [circles, setCircles] = useState<Circle[]>([]);
    const [circlesShowed, setCirclesShowed] = useState<Circle[]>([]);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const searchHandle = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setCirclesShowed(
            circles.filter((value) => value.title.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())),
        );
    };

    useEffect(() => {
        const fetchCircleContent = async () => {
            setError('');
            setLoading(true);
            const token = getCookie('token');
            if (token === '') return navigate('/login');
            const userId = searchParams.get('userId');
            if (userId === null) return navigate('/login');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/circle-member/${userId}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch todo content');
                }
                const json = await response.json();
                if (!json.success) throw new Error(json.message);
                console.log(json.payload);
                setLoading(false);
                setCircles(json.payload);
                setCirclesShowed(json.payload);
            } catch (error) {
                setCircles([]);
                setLoading(false);
                if (error instanceof Error) {
                    setError(error.message);
                    console.error('Error fetching todo content:', error);
                }
            }
        };
        fetchCircleContent();
    }, [searchParams, navigate, refresh]);
    return (
        <div className={styles.container}>
            {loading && <Loading />}
            {isCreating && <CreateCircle setIsCreating={setIsCreating} refresh={refresh} setRefresh={setRefresh} />}
            <div className={styles.header}>
                <div className={styles.leftMenu}>
                    <div className={styles.leftMenuButton} onClick={() => setIsCreating(true)}>
                        Create circle
                    </div>
                    <div className={styles.leftMenuButton} onClick={() => setRefresh(!refresh)}>
                        Refresh
                    </div>
                </div>
                <div className={styles.search}>
                    <input id='search' className={styles.searchInput} onChange={searchHandle} />
                    <label className={styles.searchButton} htmlFor='search'>
                        Search
                    </label>
                </div>
            </div>
            <div className={styles.content}>
                {error && <h1 className={styles.error}>{error}</h1>}
                <ul className={styles.grid}>
                    {circlesShowed.map((circle) => (
                        <Circle
                            key={circle.circleid}
                            id={circle.circleid}
                            title={circle.title}
                            balance={circle.balance}
                        />
                    ))}
                </ul>
            </div>
            <div className={styles.footer}></div>
        </div>
    );
}
