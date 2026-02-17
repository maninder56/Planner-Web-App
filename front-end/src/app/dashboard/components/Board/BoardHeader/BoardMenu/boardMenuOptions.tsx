
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './boardMenuOptions.module.css'; 
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';

export default function BoardMenuOptions() {
    const [activePanel, setActivePanel] = useActivePanel(); 

    return (
        <HoverOptionsPanel title='Board Menu' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.wrapper}>menu optinso</div>
        </HoverOptionsPanel>
    ); 
}