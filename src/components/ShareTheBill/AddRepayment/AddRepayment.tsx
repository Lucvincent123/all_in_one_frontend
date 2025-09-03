import { useEffect, useState } from 'react';
import styles from './AddRepayment.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCookie } from '../../../utils';
import { NumericFormat } from 'react-number-format';

type User = {
    userid: string;
    username: string;
    email: string;
};

export default function AddRepayment({ onCancel }: { onCancel: () => void }) {
    const [query, setQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<User | null>(null);
    const [fetchedMembers, setFetchedMembers] = useState<User[]>([]);
    const [searchParams] = useSearchParams();
    const [amount, setAmount] = useState<number>(0);
    const [desc, setDesc] = useState<string>('');
    const navigate = useNavigate();
    const circleId = searchParams.get('circleId');
    const userId = searchParams.get('userId');
    const token = getCookie('token');
    const filtered = fetchedMembers.filter((member) => member.username.toLowerCase().includes(query.toLowerCase()));

    const addHandle = async () => {
        if (!circleId || !userId || !token) return;
        console.log('hello');
        if (selected === null) {
            alert('Please select a member');
            return;
        }
        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        const payload = {
            amount,
            title: desc,
            circleId,
            sender: userId,
            receiver: selected.userid,
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/repayment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error();
            const json = await response.json();
            if (!json.success) throw new Error(json.message);
            onCancel();
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                alert('Failed to add repayment');
            }
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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/circle-member/circle/${circleId}`);
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
                                        setSelected(item);
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
                    <p style={{ fontSize: 18, paddingBottom: 10 }}>Destination</p>
                    {selected === null ? (
                        'Please select your destination'
                    ) : (
                        <div className={styles.selectedMember}>
                            <div>
                                <div>{selected.username}</div>
                                <div style={{ fontSize: 10 }}>{selected.email}</div>
                            </div>

                            <div
                                onClick={() => {
                                    setSelected(null);
                                }}
                                style={{ cursor: 'pointer', padding: 2 }}
                            >
                                x
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.amount}>
                    <label style={{ padding: 10 }} htmlFor='amount'>
                        Amount (€)
                    </label>
                    <NumericFormat
                        id='amount'
                        thousandSeparator='.'
                        decimalSeparator=','
                        prefix='€ '
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        className={styles.input}
                        placeholder='€ 0,00'
                        style={{ textAlign: 'center' }}
                        value={amount}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setAmount(Number(e.target.value.replace('€ ', '').replace('.', '').replace(',', '.')));
                        }}
                    />
                </div>
                <div className={styles.desc}>
                    <label style={{ padding: 10 }}>Description</label>
                    <input
                        className={styles.descInput}
                        placeholder='Description'
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        style={{ textAlign: 'center' }}
                    />
                </div>
                <div className={styles.buttons}>
                    <div className={styles.yes} onClick={addHandle}>
                        Send
                    </div>
                    <div className={styles.no} onClick={onCancel}>
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    );
}
