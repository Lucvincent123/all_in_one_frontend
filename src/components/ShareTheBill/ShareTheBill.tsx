import { useState } from 'react';
import styles from './ShareTheBill.module.css';

import Sidebar from './Sidebar/Sidebar';
import ContentCircle from './ContentCircle/Content';
import GoToTop from '../GoToTop/GoToTop';

export default function ShareTheBill() {
    const sidebarSize = {
        min: 80,
        max: 240,
    };
    const [sidebarWidth, setSidebarWidth] = useState<number>(sidebarSize.min);
    const [content, setContent] = useState<string>('circles');

    const handleChange = (): void => {
        return sidebarWidth === sidebarSize.min ? setSidebarWidth(sidebarSize.max) : setSidebarWidth(sidebarSize.min);
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar} style={{ width: sidebarWidth }}>
                <Sidebar
                    mode={sidebarWidth === sidebarSize.max ? 'expanded' : 'narrowed'}
                    handleChange={handleChange}
                    content={content}
                    setContent={setContent}
                />
            </div>
            <div className={styles.content} style={{ marginLeft: sidebarWidth }}>
                <GoToTop />
                {content === 'circles' && <ContentCircle />}
            </div>
        </div>
    );
}
