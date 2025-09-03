import Navbar from '../Navbar/Navbar';

export default function AboutPage() {
    return (
        <div className='about-page'>
            <div className='header grid'>
                <Navbar />
            </div>

            <div className='content grid'>About page</div>

            <div className='footer grid'>footer</div>
        </div>
    );
}
