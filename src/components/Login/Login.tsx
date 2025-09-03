// Import built-in modules
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';

// Import css
import styles from './Login.module.css';

// Import components
import Loading from '../Loading/Loading';

export default function Login() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    let entry = searchParams.get('entry');
    if (!entry) entry = '/';

    // States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handlers
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            // Make API call to login
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const json = await response.json();
            setIsLoading(false);
            if (!response.ok) {
                throw new Error(json.message || 'Login failed');
            }
            console.log('Login successful:', json);
            document.cookie = `token=${json.token}; path=/; max-age=3600`; // Set token in cookie
            navigate(entry, { replace: true });
        } catch (error) {
            setIsLoading(false);
            if (error instanceof Error) {
                setError(error.message || 'An error occurred during login');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <p className={styles.backLink}>
                    <Link to='/' className={styles.link}>
                        &#9668; Back to home
                    </Link>
                </p>
                <h2 className={styles.title}>Login form</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor='email'>Email:</label>
                        <input
                            className={styles.input}
                            type='email'
                            id='email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor='password'>Password:</label>
                        <input
                            className={styles.input}
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <input
                        className={styles.showPassword}
                        type='checkbox'
                        id='showPassword'
                        checked={showPassword}
                        onChange={togglePasswordVisibility}
                    />
                    <label className={styles.showPasswordLabel} htmlFor='showPassword'>
                        Show password
                    </label>
                    <button type='submit' className={styles.button}>
                        Login
                    </button>
                </form>
                {error && <p className={styles.error}>* {error} *</p>}
                <p className={styles.footerText}>
                    Forgot your password?{' '}
                    <Link className={styles.link} to='/forgot-password'>
                        Reset password
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
