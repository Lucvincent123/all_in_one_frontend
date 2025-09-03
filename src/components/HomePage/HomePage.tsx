import { useSearchParams, Link } from 'react-router-dom';

import styles from './HomePage.module.css';

import Navbar from '../Navbar/Navbar';
import ResetPassword from '../ResetPassword/ResetPassword';

export default function HomePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    if (token) return <ResetPassword token={token} />;
    return (
        <div className='home-page'>
            <div className='header grid'>
                <Navbar />
            </div>

            <div className='content grid'>
                <div className={styles.shareTheBill}>
                    <h1 className={styles.shareTheBill_title}>Manage your shared account!</h1>
                    <Link to='/share-the-bill'>Get started</Link>
                </div>
            </div>

            <div className='footer grid'>footer</div>
        </div>
    );
}
