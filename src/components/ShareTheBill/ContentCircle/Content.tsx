import AllCircles from '../AllCircles/AllCircles';
import OneCircle from '../OneCircle/OneCircle';
import { useSearchParams } from 'react-router-dom';
export default function Content() {
    const [searchParams] = useSearchParams();

    const path = searchParams.get('path');
    switch (path) {
        case 'circle':
            return <OneCircle />;
        default:
            return <AllCircles />;
    }
}
