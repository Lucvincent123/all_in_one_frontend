import { useEffect, useState } from 'react';
import styles from './AddExpense.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCookie } from '../../../utils';
import { NumericFormat } from 'react-number-format';

type User = {
    userid: string;
    username: string;
    email: string;
    amount?: number;
};

export default function AddExpense({ onCancel }: { onCancel: () => void }) {
    const [amount, setAmount] = useState<number>(0);
    const [desc, setDesc] = useState<string>('');
    const [isSplitPaid, setIsSplitPaid] = useState<boolean>(false);
    const [isSplitDebt, setIsSplitDebt] = useState<boolean>(false);
    const [isValidPaid, setIsValidPaid] = useState<boolean>(true);
    const [isValidDebt, setIsValidDebt] = useState<boolean>(true);
    const [fetchedMembers, setFetchedMembers] = useState<User[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const circleId = searchParams.get('circleId');
    const token = getCookie('token');

    const [payUsers, setPayUsers] = useState<User[]>([]);
    const [debtUsers, setDebtUsers] = useState<User[]>([]);

    useEffect(() => {
        setIsValidPaid(isValidSplit(payUsers, amount));
    }, [payUsers, amount]);

    useEffect(() => {
        setIsValidDebt(isValidSplit(debtUsers, amount));
    }, [debtUsers, amount]);

    const isValidSplit = (users: User[], total: number) => {
        const sum = users.reduce((acc, u) => acc + (u.amount || 0), 0);
        return Math.abs(sum - total) < 0.01;
    };

    const addPay = () => {
        setPayUsers((prev) => [...prev, { userid: '', username: '', email: '', amount: 0 }]);
    };

    const addDebt = () => {
        setDebtUsers((prev) => [...prev, { userid: '', username: '', email: '', amount: 0 }]);
    };

    const stopSplitPaid = () => {
        setIsSplitPaid(false);
    };

    const stopSplitDebt = () => {
        setIsSplitDebt(false);
    };

    useEffect(() => {
        if (!circleId) return;
        if (token === '') {
            navigate('/login');
            return;
        }
        const fetchMembers = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/circle-member/circle/${circleId}`,
                    {
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                );
                if (!response.ok) throw new Error();
                const json = await response.json();
                if (!json.success) throw new Error();
                setFetchedMembers(json.payload);
            } catch (error) {
                if (error instanceof Error) console.error(error.message);
                navigate('/login');
            }
        };
        fetchMembers();
    }, [circleId, navigate, token]);

    useEffect(() => {
        if (!isSplitPaid || payUsers.length === 0) return;
        const splitAmount = Number((amount / payUsers.length).toFixed(2));
        setPayUsers((prev) => prev.map((user) => ({ ...user, amount: splitAmount })));
    }, [isSplitPaid, amount, payUsers.length]);

    useEffect(() => {
        if (!isSplitDebt || debtUsers.length === 0) return;
        const splitAmount = Number((amount / debtUsers.length).toFixed(2));
        setDebtUsers((prev) => prev.map((user) => ({ ...user, amount: splitAmount })));
    }, [isSplitDebt, amount, debtUsers.length]);

    const addHandler = async () => {
        if (!circleId || token === '') {
            navigate('/login');
            return;
        }
        if (amount <= 0 || desc.trim() === '' || payUsers.length === 0 || debtUsers.length === 0) {
            alert('Please fill in all fields');
            return;
        }
        if (!isValidPaid || !isValidDebt) {
            alert('Please make sure the amounts are valid');
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/expense/`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    circleId,
                    amount,
                    title: desc,
                    payments: payUsers.map((user) => ({ userId: user.userid, amount: user.amount })),
                    debts: debtUsers.map((user) => ({ userId: user.userid, amount: user.amount })),
                }),
            });
            if (!response.ok) throw new Error();
            const json = await response.json();
            if (!json.success) throw new Error();
            onCancel();
        } catch (error) {
            if (error instanceof Error) console.error(error.message);
            onCancel();
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <p className={styles.title}>Add Expense</p>
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
                        placeholder='€ 0,00'
                        style={{ textAlign: 'center' }}
                        value={amount}
                        onChange={(e) => {
                            console.log(payUsers);
                            setAmount(Number(e.target.value.replace('€ ', '').replace('.', '').replace(',', '.')));
                        }}
                    />
                </div>
                <div className={styles.desc}>
                    <label style={{ padding: 10 }}>Description</label>
                    <input
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className={styles.descInput}
                        placeholder='Description'
                        style={{ textAlign: 'center' }}
                    />
                </div>
                <div className={styles.pay}>
                    <div>
                        <input
                            id='split'
                            type='checkbox'
                            style={{ marginRight: 10, transform: 'scale(1.5)' }}
                            onChange={() => setIsSplitPaid(!isSplitPaid)}
                            checked={isSplitPaid}
                        />
                        <label htmlFor='split' className={styles.splitLabel}>
                            Split
                        </label>
                    </div>
                    <div
                        className={styles.userList}
                        style={isValidPaid ? { borderColor: 'green' } : { borderColor: 'red' }}
                    >
                        <label style={{ padding: 10 }}>Paid by</label>
                        <ul className={styles.list}>
                            {payUsers.map((user, index) => (
                                <UserRow
                                    key={index}
                                    userInfo={user}
                                    onDelete={() => {
                                        setPayUsers(payUsers.filter((_, ind) => index != ind));
                                    }}
                                    onChange={(newUser) => {
                                        const newUsers = [...payUsers];
                                        newUsers[index] = newUser;
                                        setPayUsers(newUsers);
                                    }}
                                    stopSplit={stopSplitPaid}
                                    fetchedMembers={fetchedMembers}
                                />
                            ))}
                        </ul>
                        <div className={styles.addUser} onClick={addPay}>
                            +
                        </div>
                    </div>
                </div>
                <div className={styles.debt}>
                    <div>
                        <input
                            id='split'
                            type='checkbox'
                            style={{ marginRight: 10, transform: 'scale(1.5)' }}
                            onChange={() => setIsSplitDebt(!isSplitDebt)}
                            checked={isSplitDebt}
                        />
                        <label htmlFor='split' className={styles.splitLabel}>
                            Split
                        </label>
                    </div>
                    <div
                        className={styles.userList}
                        style={isValidDebt ? { borderColor: 'green' } : { borderColor: 'red' }}
                    >
                        <label style={{ padding: 10 }}>Split between</label>
                        <ul className={styles.list}>
                            {debtUsers.map((user, index) => (
                                <UserRow
                                    key={index}
                                    userInfo={user}
                                    onDelete={() => {
                                        setDebtUsers(debtUsers.filter((_, ind) => index != ind));
                                    }}
                                    onChange={(newUser) => {
                                        const newUsers = [...debtUsers];
                                        newUsers[index] = newUser;
                                        setDebtUsers(newUsers);
                                    }}
                                    stopSplit={stopSplitDebt}
                                    fetchedMembers={fetchedMembers}
                                />
                            ))}
                        </ul>
                        <div className={styles.addUser} onClick={addDebt}>
                            +
                        </div>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.yes} onClick={addHandler}>
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

function UserRow({
    userInfo,
    onDelete,
    onChange,
    stopSplit,
    fetchedMembers,
}: {
    userInfo: User;
    onDelete: () => void;
    onChange: (user: User) => void;
    stopSplit: () => void;
    fetchedMembers?: User[];
}) {
    const [query, setQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <li className={styles.listItem}>
            <div className={styles.user}>
                <input
                    className={styles.search}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onChange({ ...userInfo, userid: '', username: '', email: '' });
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                    }}
                    onBlur={() => {
                        setIsOpen(false);
                    }}
                />
                <ul className={styles.dropdownMenu}>
                    {isOpen && (
                        <div className={styles.dropdown}>
                            {fetchedMembers &&
                                fetchedMembers.map((user, index) => (
                                    <li
                                        key={index}
                                        className={styles.dropdownItem}
                                        onMouseDown={() => {
                                            onChange({
                                                ...userInfo,
                                                userid: user.userid,
                                                username: user.username,
                                                email: user.email,
                                            });
                                            setIsOpen(false);
                                            setQuery(user.username);
                                        }}
                                    >
                                        {user.username}
                                        <div style={{ fontSize: 10 }}>{user.email}</div>
                                    </li>
                                ))}
                        </div>
                    )}
                </ul>
            </div>
            <div className={styles.userAmount}>
                <NumericFormat
                    className={styles.amountInput}
                    thousandSeparator='.'
                    decimalSeparator=','
                    prefix='€ '
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    placeholder='€ 0,00'
                    style={{ textAlign: 'center' }}
                    value={userInfo.amount}
                    onChange={(e) => {
                        onChange({
                            ...userInfo,
                            amount: Number(e.target.value.replace('€ ', '').replace('.', '').replace(',', '.')),
                        });
                        stopSplit();
                    }}
                />
            </div>
            <div className={styles.x} onClick={onDelete}>
                X
            </div>
        </li>
    );
}
