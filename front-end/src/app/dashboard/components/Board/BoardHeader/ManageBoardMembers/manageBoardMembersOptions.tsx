
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './manageBoardMembersOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';

export default function ManageBoardMembersOptions() {
    const [activePanel, setActivePanel] = useActivePanel(); 

    return (
        <BigHoverPanel title='Manage Board Members' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                Manage board members
            </div>
        </BigHoverPanel>
    ); 
}