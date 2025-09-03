import { useState, useEffect } from 'react';
import styles from './GoToTop.module.css';

export default function GoToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 100) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button className={`${styles.toTopBtn} ${visible ? styles.show : ''}`} onClick={scrollToTop}>
            ⬆ Top
        </button>
    );
}
