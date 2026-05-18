

import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './inboxOptions.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';

export default function InboxOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <BigHoverPanel title='Inbox' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                inbox
            </div>
        </BigHoverPanel>
    ); 
}