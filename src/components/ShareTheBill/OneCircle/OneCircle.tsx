import { memo, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

import styles from './OneCircle.module.css';
import { addQueries } from '../../../utils';
import Confirm from '../../Confirm/Confirm';
import Transactions from '../Transactions/Transactions';
import Members from '../Members/Members';

function OneCircle() {
    const [content, setContent] = useState<string>('transactions');
    const [isConfirming, setIsConfirming] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0,
    });
    const [searchParams] = useSearchParams();
    const title = searchParams.get('circleTitle');
    const location = useLocation();
    const navigate = useNavigate();

    const backHandle = () => {
        const newUrl = addQueries(location, {
            path: null,
            circleId: null,
            circleTitle: null,
        });
        console.log(newUrl);
        navigate(newUrl);
    };

    const deleteHandle = () => {
        setIsConfirming(true);
    };

    const confirmDeleteHandle = async () => {
        console.log('deleted');
    };

    const cancelDeleteHandle = () => {
        setIsConfirming(false);
    };

    return (
        <div className={styles.container}>
            {isConfirming && (
                <Confirm
                    message='Do you really want to delete this circle???'
                    onYes={confirmDeleteHandle}
                    onNo={cancelDeleteHandle}
                />
            )}
            <div className={styles.header}>
                <div className={styles.leftMenu}>
                    <div style={{ cursor: 'pointer' }} onClick={backHandle}>
                        &#9668; All circles
                    </div>
                </div>
                <div className={styles.title}>{title}</div>
                <div className={styles.rightMenu}>
                    <div onClick={deleteHandle} className={styles.rightMenuItem}>
                        Delete
                    </div>
                    <div
                        className={styles.rightMenuItem}
                        onClick={() => {
                            setRefresh(!refresh);
                        }}
                    >
                        Refresh
                    </div>
                </div>
                <nav className={styles.navbar}>
                    <ul
                        className={styles.navbarList}
                        onMouseLeave={() =>
                            setPosition((pre) => {
                                return { ...pre, opacity: 0 };
                            })
                        }
                    >
                        <Tab
                            setPosition={setPosition}
                            clickHandle={() => {
                                setContent('transactions');
                            }}
                        >
                            Transactions
                        </Tab>
                        <Tab
                            setPosition={setPosition}
                            clickHandle={() => {
                                setContent('members');
                            }}
                        >
                            Members
                        </Tab>
                        <motion.li className={styles.cursor} animate={position} />
                    </ul>
                </nav>
            </div>
            <div className={styles.content}>
                {content === 'members' && <Members refresh={refresh} />}
                {content === 'transactions' && <Transactions refresh={refresh} />}
            </div>
            <div className={styles.footer}>Footer</div>
        </div>
    );
}

function Tab({
    children,
    setPosition,
    clickHandle,
}: {
    children: ReactNode;
    setPosition: ({ left, width, opacity }: { left: number; width: number; opacity: number }) => void;
    clickHandle: () => void;
}) {
    const ref = useRef<HTMLLIElement>(null);
    return (
        <li
            ref={ref}
            onMouseEnter={() => {
                if (!ref.current) return;
                const { width } = ref.current.getBoundingClientRect();
                setPosition({
                    width,
                    left: ref.current.offsetLeft,
                    opacity: 1,
                });
            }}
            className={styles.navbarItem}
            onClick={clickHandle}
        >
            {children}
        </li>
    );
}

export default memo(OneCircle);
