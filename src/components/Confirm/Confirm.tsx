import { memo } from 'react';

import styles from './Confirm.module.css';

function Confirm({ message, onYes, onNo }: { message: string; onYes: () => void; onNo: () => void }) {
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h1 className={styles.message}>{message}</h1>
                <div className={styles.buttons}>
                    <div onClick={onYes} className={styles.yes}>
                        Yes
                    </div>
                    <div onClick={onNo} className={styles.no}>
                        No
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Confirm);
