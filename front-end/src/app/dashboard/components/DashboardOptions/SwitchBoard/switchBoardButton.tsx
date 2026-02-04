
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './switchBoardButton.module.css'; 
import Image from 'next/image';
import SwitchBoardOptions from './switchBoardOptions';


export default function SwitchBoardButton() {
    const [activePanel, setActivePanel] = useActivePanel(); 

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(activePanel === 'switchBoardOptions' ? 'none' : 'switchBoardOptions'); 
                }}>
                <Image src={'./switchBoard.svg'} alt='switch board icon' width={20} height={20} />
                <span>Switch Board</span>
            </div>
            {
                activePanel === 'switchBoardOptions' ? 
                <SwitchBoardOptions />
                : null
            }
        </div>
    ); 
}