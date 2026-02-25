
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './switchBoardButton.module.css'; 
import Image from 'next/image';
import SwitchBoardOptions from './switchBoardOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';


export default function SwitchBoardButton() {
    const isSwitchBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'switchBoardOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isSwitchBoardOptionsOpen ? 'none' : 'switchBoardOptions'); 
                }}>
                <Image src={'./switchBoard.svg'} alt='switch board icon' width={20} height={20} />
                <span>Switch Board</span>
            </div>
            {
                isSwitchBoardOptionsOpen ? 
                <SwitchBoardOptions />
                : null
            }
        </div>
    ); 
}