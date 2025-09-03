import { Route, Routes } from 'react-router-dom';

import './App.css';

// Import components or pages
import HomePage from './components/HomePage/HomePage';
import AboutPage from './components/AboutPage/AboutPage';
import ContactPage from './components/ContactPage/ContactPage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Protected from './components/Protected/Protected';
import ShareTheBill from './components/ShareTheBill/ShareTheBill';

function App() {
    console.log('render');
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route
                path='/share-the-bill'
                element={
                    <Protected>
                        <ShareTheBill />
                    </Protected>
                }
            />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
