
import { panelType } from '@/app/dashboard/Types/UIState';
import styles from './newBoardButton.module.css'; 
import Image from 'next/image';
import NewBoardOptions from './newBoardOptions';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';


export default function NewBoardButton() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const isNewBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'newBoardOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <button className={styles.mainButton}
                disabled={isBoardLoading}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isNewBoardOptionsOpen ? 'none' : 'newBoardOptions'); 
                }}>
                <svg height="20" width="20" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" 
                        clipRule="evenodd" strokeLinecap="round"  strokeLinejoin="round">
                        <path d="M6 12h12m-6-6v12" fill="none" fillRule="nonzero" stroke="#000" 
                            strokeWidth="2" transform="matrix(56.51202 0 0 56.51203 -278.144 -278.144)"/>
                    </svg>
                <span>New Board</span>
            </button>
            {
                isNewBoardOptionsOpen ? 
                <NewBoardOptions />
                : null
            }
        </div>
    ); 
}