
import { panelType } from '@/app/dashboard/Types/UIState';
import styles from './newBoardButton.module.css'; 
import Image from 'next/image';
import NewBoardOptions from './newBoardOptions';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';


export default function NewBoardButton() {
    const isNewBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'newBoardOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isNewBoardOptionsOpen ? 'none' : 'newBoardOptions'); 
                }}>
                <Image src={'./plusSign.svg'} alt='plus sign icon' width={20} height={20} />
                <span>New Board</span>
            </div>
            {
                isNewBoardOptionsOpen ? 
                <NewBoardOptions />
                : null
            }
        </div>
    ); 
}