
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './filterButton.module.css'; 
import FilterBoardOptions from './filterButtonOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import Button from '@/Components/Buttons/button';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function FilterButton() {
    const cards = useBoardStore((state) => state.cards); 
    const isFilterBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'filterBoardOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isFilterActive = useBoardUIStore((state) => state.isFilterActive()); 
    const resetFilter = useBoardUIStore((state) => state.resetFilters);
    const applyFilters = useBoardUIStore((state) => state.applyFilters); 
    
    function handleClearFilter() {
        resetFilter(); 
        applyFilters(cards); 
        setActivePanel('none'); 
    }

    return (
        <div className={[styles.wrapper, 
            isFilterActive ? styles.filterActive : ''].join(' ')} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isFilterBoardOptionsOpen ? 'none' : 'filterBoardOptions'); 
                }}
            >
                {/* filter logo */}
                <svg width="100" height="100" viewBox="0 0 1.875 1.875" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 .313h1.875m-1.5.625H1.5m-.875.625h.625" stroke="#ffffff" strokeWidth=".125"/>
                </svg>
            </div>
            { isFilterActive && 
                <button className={styles.clearFilterButton} onClick={handleClearFilter}
                >Clear</button> }
            { isFilterBoardOptionsOpen && <FilterBoardOptions /> }
        </div>
    ); 
}