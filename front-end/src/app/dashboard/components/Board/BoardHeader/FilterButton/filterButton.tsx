
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './filterButton.module.css'; 
import FilterBoardOptions from './filterButtonOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';

export default function FilterButton() {
    const isFilterBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'filterBoardOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isFilterBoardOptionsOpen ? 'none' : 'filterBoardOptions'); 
                }}
            >
                {/* filter logo */}
                <svg width="100px" height="100px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 3H16V1H0V3Z" fill="#ffffff"/>
                    <path d="M2 7H14V5H2V7Z" fill="#ffffff"/>
                    <path d="M4 11H12V9H4V11Z" fill="#ffffff"/>
                    <path d="M10 15H6V13H10V15Z" fill="#ffffff"/>
                </svg>
            </div>
            {
                isFilterBoardOptionsOpen ?
                <FilterBoardOptions />
                : null
            }
        </div>
    ); 
}