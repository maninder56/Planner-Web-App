
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './shareButtonOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';

export default function ShareButtonOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    

    return (
        <BigHoverPanel title='Share Board' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                Share board options
            </div>
        </BigHoverPanel>
    ); 
}