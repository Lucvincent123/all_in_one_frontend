import { memo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './Circle.module.css';
import Euro from '../../../assets/currencies/euro.png';
import { addQueries } from '../../../utils';

function Circle({ id, title, balance }: { id: string; title: string; balance: number }) {
    const [status, setStatus] = useState<string>(styles.zero);
    const location = useLocation();
    const navigate = useNavigate();
    const handleClick = () => {
        const newUrl = addQueries(location, {
            path: 'circle',
            circleId: id,
            circleTitle: title,
        });
        navigate(newUrl);
    };
    useEffect(() => {
        if (balance > 0) setStatus(styles.positive);
        else if (balance < 0) setStatus(styles.negative);
        else setStatus(styles.zero);
    }, [balance]);
    console.log(balance);
    return (
        <li key={id} className={`${status} ${styles.circle}`} onClick={handleClick}>
            <h1 className={styles.circleTitle}>{title}</h1>
            <p className={styles.circleBalance}>
                <img src={Euro} alt='euro' className={styles.currency} />
                {balance}
            </p>
        </li>
    );
}

export default memo(Circle);
