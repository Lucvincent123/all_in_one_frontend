import { useEffect, useState } from 'react';
import styles from './AddMember.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCookie } from '../../../utils';

type User = {
    userid: string;
    username: string;
    email: string;
};

export default function AddMember({ onCancel }: { onCancel: () => void }) {
    const [query, setQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [fetchedMembers, setFetchedMembers] = useState<User[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const circleId = searchParams.get('circleId');
    const token = searchParams.get('token');
    const selectedIds = new Set(selectedMembers.map((m) => m.userid));
    const filtered = fetchedMembers.filter(
        (member) => member.username.toLowerCase().includes(query.toLowerCase()) && !selectedIds.has(member.userid),
    );

    const addHandle = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/circle-member/add-member/${circleId}`,
                {
                    method: 'POST',
                    headers: {
                        authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userIds: Array.from(selectedIds),
                    }),
                },
            );
            console.log(Array.from(selectedIds));
            if (!response.ok) throw new Error();
            const json = await response.json();
            if (!json.success) throw new Error();
            onCancel();
        } catch (error) {
            if (error instanceof Error) console.error(error.message);
            onCancel();
        }
    };

    useEffect(() => {
        if (!circleId) return;
        const token = getCookie('token');
        if (token === '') {
            navigate('/login');
            return;
        }
        const fetchMembersToAdd = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/circle-member/add-member/${circleId}`,
                    {
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    },
                );
                if (!response.ok) throw new Error();
                const json = await response.json();
                if (!json.success) throw new Error();
                console.log(json.payload);
                setFetchedMembers(json.payload);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
            }
        };

        fetchMembersToAdd();
    }, [circleId, navigate]);
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h1 className={styles.title}>Add members</h1>
                <div className={styles.search}>
                    <input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => {
                            setIsOpen(false);
                        }}
                        className={styles.input}
                    />

                    <ul className={styles.dropdown}>
                        {isOpen &&
                            filtered.length > 0 &&
                            filtered.map((item, idx) => (
                                <li
                                    className={styles.dropdownItem}
                                    key={idx}
                                    onMouseDown={() => {
                                        setSelectedMembers((prev) => [...prev, item]);
                                        setQuery('');
                                        setIsOpen(false);
                                    }}
                                >
                                    <h1>{item.username}</h1>
                                    <p className={styles.dropdownItemEmail}>{item.email}</p>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className={styles.membersSelected}>
                    <p style={{ fontSize: 16 }}>Members:</p>
                    <ul className={styles.selectedList}>
                        {selectedMembers.map((member, index) => (
                            <li key={index} className={styles.selectedMember}>
                                <div>
                                    <div>{member.username}</div>
                                    <div style={{ fontSize: 10 }}>{member.email}</div>
                                </div>

                                <div
                                    onClick={() => {
                                        setSelectedMembers(selectedMembers.filter((_, ind) => ind !== index));
                                    }}
                                    style={{ cursor: 'pointer', padding: 2 }}
                                >
                                    x
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.yes} onClick={addHandle}>
                        Add
                    </div>
                    <div className={styles.no} onClick={onCancel}>
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    );
}
