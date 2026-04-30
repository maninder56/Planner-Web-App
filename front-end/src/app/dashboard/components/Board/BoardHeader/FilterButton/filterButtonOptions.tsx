
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './filterButtonOptions.module.css'; 
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import { useState } from 'react';
import Image from 'next/image';
import Button from '@/Components/Buttons/button';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import SearchBar from '@/Components/Inputs/Search/searchBar';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function FilterBoardOptions() {
    const filters = useBoardUIStore((state) => state.filters); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const toggleFilter = useBoardUIStore((state) => state.toggleFilter); 
    const resetFilters = useBoardUIStore((state) => state.resetFilters); 

    const [searchInput, setSearchInput] = useState(''); 
    

    return (
        <HoverOptionsPanel title='Filter' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.search}>
                <SearchBar 
                    placeHolder='Search this board'
                    value={searchInput}
                    setValue={(newValue) => setSearchInput(newValue)} />
            </div>
            {/* Card Status */}
            <div className={styles.checkOptions}>
                <header>Card Status</header>
                <div onClick={() => toggleFilter('cardStatusCompleted')}>
                    <input type='checkbox' checked={filters.cardStatusCompleted} readOnly />
                    <label>Completed</label>
                </div>
                <div onClick={() => toggleFilter('cardStatusNotCompleted')}>
                    <input type='checkbox' checked={filters.cardStatusNotCompleted} readOnly />
                    <label>Not Completed</label>
                </div>
            </div>

            <hr className={styles.hrTag} />

            {/* Priority */}
            <div className={styles.checkOptions}>
                <header>Priority</header>
                <div onClick={() => toggleFilter('priorityHigh')}>
                    <input type='checkbox' checked={filters.priorityHigh} readOnly />
                    <label>High</label>
                </div>
                <div onClick={() => toggleFilter('priorityMedium')}>
                    <input type='checkbox' checked={filters.priorityMedium} readOnly />
                    <label>Medium</label>
                </div>
                <div onClick={() => toggleFilter('priorityLow')}>
                    <input type='checkbox' checked={filters.priorityLow} readOnly />
                    <label>Low</label>
                </div>
            </div>
        
            <hr className={styles.hrTag} />

            {/* Due Date */}
            <div className={styles.checkOptions}>
                <header>Due Date</header>
                <div onClick={() => toggleFilter('dueOverdue')}>
                    <input type='checkbox' checked={filters.dueOverdue} readOnly />
                    <label>Overdue</label>
                </div>
                <div onClick={() => toggleFilter('dueTomorrow')}>
                    <input type='checkbox' checked={filters.dueTomorrow} readOnly />
                    <label>Due tomorrow</label>
                </div>
                <div onClick={() => toggleFilter('dueThisWeek')}>
                    <input type='checkbox' checked={filters.dueThisWeek} readOnly />
                    <label>Due this week</label>
                </div>
                <div onClick={() => toggleFilter('dueThisMonth')}>
                    <input type='checkbox' checked={filters.dueThisMonth} readOnly />
                    <label>Due this month</label>
                </div>
            </div>

            <div className={styles.resetButton}>
                <Button 
                    name='Reset Filters' 
                    color='blue' 
                    onClick={resetFilters} 
                />
            </div>
        </HoverOptionsPanel>
    ); 
}