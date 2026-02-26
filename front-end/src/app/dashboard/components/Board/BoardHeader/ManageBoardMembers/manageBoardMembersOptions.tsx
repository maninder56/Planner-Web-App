
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './manageBoardMembersOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';

export default function ManageBoardMembersOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <BigHoverPanel title='Manage Board Members' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                Manage board members
            </div>
        </BigHoverPanel>
    ); 
}