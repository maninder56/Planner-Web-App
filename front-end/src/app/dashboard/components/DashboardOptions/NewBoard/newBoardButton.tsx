
import { panelType } from '@/Types/UIState';
import styles from './newBoardButton.module.css'; 
import Image from 'next/image';


export default function NewBoardButton({
    activePanel, 
    setActivePanel,
}: {
    activePanel: panelType
    setActivePanel: (panel: panelType) => void; 
}) {
    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(activePanel === 'newBoardOptions' ? 'none' : 'newBoardOptions'); 
                }}>
                <Image src={''} alt='plus sign icon' width={20} height={20} />
                <span>New Board</span>
            </div>
            {
                activePanel === 'newBoardOptions' ? 
                <div>
                    
                </div>
                : null
            }
        </div>
    ); 
}