import { memo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCookie } from '../../../utils';

import styles from './Transactions.module.css';
import SendArrow from '../../../assets/icons/send_arrow.svg';
import AddRepayment from '../AddRepayment/AddRepayment';
import AddExpense from '../AddExpense/AddExpense';

import { formatDate } from '../../../utils/date';

type ID = number;
type User = {
    id: ID;
    username: string;
    email: string;
    amount?: string;
};

type Repayment = {
    type: 'repayment';
    id: ID;
    sender: User;
    receiver: User;
    amount: string;
    date: Date;
    description: string;
};

type Expense = {
    type: 'expense';
    id: ID;
    amount: string;
    description: string;
    date: Date;
    payments: User[];
    debts: User[];
};

type Transaction = Expense | Repayment;

function Transactions({ refresh }: { refresh: boolean }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [openId, setOpenId] = useState<ID | null>(null);
    const [selfRefresh, setSelfRefresh] = useState<boolean>(false);

    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const [isAddingRepayment, setIsAddingRepayment] = useState<boolean>(false);
    const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);
    const navigate = useNavigate();

    const filtered = transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    const onCancel = () => {
        setIsAddingRepayment(false);
        setIsAddingExpense(false);
        setSelfRefresh(!selfRefresh);
    };

    useEffect(() => {
        const token = getCookie('token');
        if (!token) {
            navigate('/login');
        } else {
            const fetchTransactions = async () => {
                const circleId = searchParams.get('circleId');
                const fetchedTransactions: Transaction[] = [];
                const fetchRepayments = async () => {
                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/repayment/${circleId}`, {
                            headers: { authorization: `Bearer ${token}` },
                        });
                        if (!response.ok) throw new Error('Failed to fetch repayments');
                        const json = await response.json();
                        if (!json.success) throw new Error(json.message);
                        const fetchedRepayments: {
                            id: number;
                            sender: User;
                            receiver: User;
                            amount: string;
                            date: string;
                            description: string;
                        }[] = json.payload;

                        fetchedRepayments.forEach(
                            (repayment: {
                                id: number;
                                sender: User;
                                receiver: User;
                                amount: string;
                                date: string;
                                description: string;
                            }) =>
                                fetchedTransactions.push({
                                    ...repayment,
                                    date: new Date(repayment.date),
                                    type: 'repayment',
                                }),
                        );
                    } catch (error) {
                        if (error instanceof Error) console.error(error.message);
                    }
                };
                const fetchExpenses = async () => {
                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/expense/${circleId}`, {
                            headers: { authorization: `Bearer ${token}` },
                        });
                        if (!response.ok) throw new Error('Failed to fetch expenses');
                        const json = await response.json();
                        if (!json.success) throw new Error(json.message);
                        const fetchedExpenses: {
                            id: number;
                            amount: string;
                            description: string;
                            date: string;
                            payments: User[];
                            debts: User[];
                        }[] = json.payload;

                        fetchedExpenses.forEach(
                            (expense: {
                                id: number;
                                amount: string;
                                description: string;
                                date: string;
                                payments: User[];
                                debts: User[];
                            }) =>
                                fetchedTransactions.push({
                                    ...expense,
                                    date: new Date(expense.date),
                                    type: 'expense',
                                }),
                        );
                    } catch (error) {
                        if (error instanceof Error) console.error(error.message);
                        return [];
                    }
                };
                await fetchRepayments();
                await fetchExpenses();
                console.log(fetchedTransactions);
                setTransactions(fetchedTransactions);
            };
            fetchTransactions();
        }
    }, [refresh, selfRefresh, navigate, searchParams]);

    return (
        <div id='transactions' className={styles.container}>
            <div className={styles.header}>
                <div className={styles.button} onClick={() => setIsAddingExpense(true)}>
                    Create an expense
                </div>
                <div className={styles.button} onClick={() => setIsAddingRepayment(true)}>
                    Create a repayment
                </div>
            </div>
            {filtered.length === 0 && (
                <h1 style={{ textAlign: 'center', fontSize: 20, padding: 20 }}>No transactions</h1>
            )}
            <ul className={styles.transactionList}>
                {filtered.map((transaction, index) => {
                    if (transaction.type === 'repayment')
                        return (
                            <li key={index} className={styles.transactionItem}>
                                <div
                                    className={styles.main}
                                    style={{ backgroundColor: 'black', color: 'white' }}
                                    onClick={() => setOpenId((prev) => (prev === index ? null : index))}
                                >
                                    <span className={styles.date}>{formatDate(transaction.date)}</span>
                                    <span className={styles.description}>{transaction.description}</span>
                                    <span className={styles.change}>
                                        {transaction.receiver.id === Number(userId) && (
                                            <span style={{ color: 'red' }}>-{transaction.amount}</span>
                                        )}
                                        {transaction.sender.id === Number(userId) && (
                                            <span style={{ color: 'green' }}>+{transaction.amount}</span>
                                        )}
                                    </span>
                                </div>

                                <div className={`${styles.dropdownMenu} ${openId === index ? styles.active : ''}`}>
                                    <span className={styles.dropdownItem}>
                                        <h1>
                                            {transaction.sender.username}
                                            &nbsp;
                                            {transaction.sender.id === Number(userId) && <span>(me)</span>}
                                        </h1>
                                        <p>{transaction.sender.email}</p>
                                    </span>
                                    <span className={styles.dropdownItem}>
                                        <img src={SendArrow} alt='send to' />
                                        {transaction.amount}
                                    </span>
                                    <span className={styles.dropdownItem}>
                                        <h1>
                                            {transaction.receiver.username}&nbsp;
                                            {transaction.receiver.id === Number(userId) && <span>(me)</span>}
                                        </h1>
                                        <p>{transaction.receiver.email}</p>
                                    </span>
                                </div>
                            </li>
                        );
                    if (transaction.type === 'expense')
                        return (
                            <li key={index} className={styles.transactionItem}>
                                <div
                                    className={styles.main}
                                    onClick={() => setOpenId((prev) => (prev === index ? null : index))}
                                >
                                    <span className={styles.date}>{formatDate(transaction.date)}</span>
                                    <span className={styles.description}>{transaction.description}</span>
                                    <span className={styles.change}>
                                        {(() => {
                                            const paymentFound = transaction.payments.find((payment) => {
                                                return payment.id === Number(userId);
                                            });
                                            if (paymentFound)
                                                return <span style={{ color: 'green' }}>+{paymentFound.amount}</span>;
                                            else {
                                                const debtFound = transaction.debts.find((debt) => {
                                                    return debt.id === Number(userId);
                                                });
                                                console.log(debtFound);
                                                if (debtFound)
                                                    return <span style={{ color: 'red' }}>-{debtFound.amount}</span>;
                                                else return null;
                                            }
                                        })()}
                                    </span>
                                </div>

                                <div
                                    className={`${styles.dropdownMenu} ${styles.dropdownMenuExpense} ${
                                        openId === index ? styles.active : ''
                                    }`}
                                >
                                    <ul className={styles.userList}>
                                        {transaction.payments.map((user, index) => (
                                            <li key={index} className={styles.user}>
                                                <span className={styles.username}>
                                                    {user.username}&nbsp;
                                                    {user.id === Number(userId) && <span>(me)</span>}
                                                </span>
                                                <span className={styles.email}>{user.email}</span>
                                                <span className={styles.pay} style={{ color: 'green' }}>
                                                    +{user.amount}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className={styles.userList}>
                                        {transaction.debts.map((user, index) => (
                                            <li key={index} className={styles.user}>
                                                <span className={styles.username}>
                                                    {user.username}&nbsp;
                                                    {user.id === Number(userId) && <span>(me)</span>}
                                                </span>
                                                <span className={styles.email}>{user.email}</span>
                                                <span className={styles.pay} style={{ color: 'red' }}>
                                                    -{user.amount}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.amount}>
                                        <span>Total</span>
                                        <span>{transaction.amount}</span>
                                    </div>
                                </div>
                            </li>
                        );
                })}
            </ul>
            {isAddingRepayment && <AddRepayment onCancel={onCancel} />}
            {isAddingExpense && <AddExpense onCancel={onCancel} />}
        </div>
    );
}

export default memo(Transactions);
