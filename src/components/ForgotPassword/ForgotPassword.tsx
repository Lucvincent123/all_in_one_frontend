// Import built-in modules
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';

// Import css
import styles from './ForgotPassword.module.css';

// Import components
import Loading from '../Loading/Loading';

export default function ForgotPassword() {
    // States
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState('Send');
    const [error, setError] = useState<string | null>(null);

    // Handlers
    const submitHandle = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const json = await response.json();
            setIsLoading(false);
            if (!json.success) throw new Error(json.message);
            setSent('Resend');
        } catch (error) {
            setIsLoading(false);
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    // Render

    return (
        <div className={styles.wrapper}>
            <div className={styles.form}>
                <p className={styles.backLink}>
                    <Link to='/' className={styles.link}>
                        &#9668; Back to home
                    </Link>
                </p>
                <h2 className={styles.title}>Reset password form</h2>
                <form onSubmit={submitHandle}>
                    <div className={styles.formGroup}>
                        <label htmlFor='email'>Email:</label>
                        <input
                            className={styles.input}
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type='submit' className={styles.button}>
                        {sent}
                    </button>
                </form>
                {error && <p className={styles.error}>* {error} *</p>}
                <p className={styles.footerText}>
                    Suddenly remember your password?{' '}
                    <Link className={styles.link} to='/login'>
                        Login now
                    </Link>
                </p>
                <p className={styles.footerText}>
                    Don't have an account?{' '}
                    <Link className={styles.link} to='/register'>
                        Register here
                    </Link>
                </p>
            </div>
            {isLoading && <Loading />}
        </div>
    );
}
