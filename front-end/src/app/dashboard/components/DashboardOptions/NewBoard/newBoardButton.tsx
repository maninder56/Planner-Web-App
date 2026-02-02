
import { panelType } from '@/Types/UIState';
import styles from './newBoardButton.module.css'; 
import Image from 'next/image';
import NewBoardOptions from './newBoardOptions';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';


export default function NewBoardButton() {
    const [activePanel, setActivePanel] = useActivePanel(); 

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(activePanel === 'newBoardOptions' ? 'none' : 'newBoardOptions'); 
                }}>
                <Image src={'./plusSign.svg'} alt='plus sign icon' width={20} height={20} />
                <span>New Board</span>
            </div>
            {
                activePanel === 'newBoardOptions' ? 
                <NewBoardOptions />
                : null
            }
        </div>
    ); 
}