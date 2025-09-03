import { useEffect, useState } from 'react';
import styles from './Members.module.css';
import { useSearchParams } from 'react-router-dom';

import AddMember from '../AddMember/AddMember';

type Member = {
    userid: number;
    username: string;
    email: string;
    balance: number;
};

export default function Members({ refresh }: { refresh: boolean }) {
    const [members, setMembers] = useState<Member[]>([]);
    const [selfRefresh, setSelfRefresh] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const [isAdding, setIsAdding] = useState(false);
    const userId = searchParams.get('userId');

    const onCancel = () => {
        setIsAdding(false);
        setSelfRefresh(!selfRefresh);
    };

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const circleId = searchParams.get('circleId');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/circle-member/circle/${circleId}`);
                if (!response.ok) throw new Error();
                const json = await response.json();
                if (!json.success) throw new Error(json.message);
                setMembers(json.payload);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message || 'Failed to fetch');
                }
            }
        };
        fetchMembers();
    }, [refresh, selfRefresh]);
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div onClick={() => setIsAdding(true)} className={styles.button}>
                    + Add member
                </div>
            </div>
            <ul className={styles.memberList}>
                {members.map((member, index) => (
                    <li key={index} className={styles.member}>
                        <span className={styles.username}>
                            {member.username}&nbsp;
                            {member.userid === Number(userId) && <span>(me)</span>}
                        </span>
                        <span className={styles.email}>{member.email}</span>
                        <span
                            className={styles.balance}
                            style={(() => {
                                if (member.balance > 0) return { color: 'green' };
                                if (member.balance < 0) return { color: 'red' };
                            })()}
                        >
                            {member.balance}
                        </span>
                    </li>
                ))}
            </ul>
            {isAdding && <AddMember onCancel={onCancel} />}
        </div>
    );
}
