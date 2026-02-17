
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './shareButtonOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';

export default function ShareButtonOptions() {
    const [activePanel, setActivePanel] = useActivePanel(); 
    

    return (
        <BigHoverPanel title='Share Board' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                Share board options
            </div>
        </BigHoverPanel>
    ); 
}