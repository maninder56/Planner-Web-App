
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
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const [searchInput, setSearchInput] = useState(''); 

    const [tempFilter, setTempFilter] = useState<{
        cardStatusCompleted: boolean, 
        cardStatusNotCompleted: boolean, 
        priorityHigh: boolean, 
        priorityMedium: boolean, 
        priorityLow: boolean, 
        dueOverdue: boolean,
        dueTomorrow: boolean,
        dueThisWeek: boolean,
        dueThisMonth: boolean,
    }>({
        cardStatusCompleted: false, 
        cardStatusNotCompleted: false, 
        priorityHigh: false, 
        priorityMedium: false, 
        priorityLow: false, 
        dueOverdue: false,
        dueTomorrow: false,
        dueThisWeek: false,
        dueThisMonth: false,
    }); 
    

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

                <div
                    onClick={(e) => {
                        e.stopPropagation(); 
                        setTempFilter(prev => ({
                            ...prev,
                            cardStatusNotCompleted: false, 
                            cardStatusCompleted: !prev.cardStatusCompleted,
                        }));
                    }}
                >
                    <input 
                        type='checkbox' 
                        checked={tempFilter.cardStatusCompleted} 
                        readOnly 
                    />
                    <label>Completed</label>
                </div>

                <div
                    onClick={(e) => {
                        e.stopPropagation(); 
                        setTempFilter(prev => ({
                            ...prev,
                            cardStatusNotCompleted: !prev.cardStatusNotCompleted, 
                            cardStatusCompleted: false, 
                        }));
                    }}
                >
                    <input 
                        type='checkbox' 
                        checked={tempFilter.cardStatusNotCompleted} 
                        readOnly 
                    />
                    <label>Not Completed</label>
                </div>
            </div>

            <hr className={styles.hrTag} />

            {/* Priority */}
            <div className={styles.checkOptions}>
                <header>Priority</header>

                <div onClick={() => setTempFilter(prev => ({ ...prev, priorityHigh: !prev.priorityHigh }))}>
                    <input type='checkbox' checked={tempFilter.priorityHigh} readOnly />
                    <label>High</label>
                </div>

                <div onClick={() => setTempFilter(prev => ({ ...prev, priorityMedium: !prev.priorityMedium }))}>
                    <input type='checkbox' checked={tempFilter.priorityMedium} readOnly />
                    <label>Medium</label>
                </div>

                <div onClick={() => setTempFilter(prev => ({ ...prev, priorityLow: !prev.priorityLow }))}>
                    <input type='checkbox' checked={tempFilter.priorityLow} readOnly />
                    <label>Low</label>
                </div>
            </div>
        
            <hr className={styles.hrTag} />

            {/* Due Date */}
            <div className={styles.checkOptions}>
                <header>Due Date</header>

                <div onClick={() => setTempFilter(prev => ({ ...prev, dueOverdue: !prev.dueOverdue }))}>
                    <input type='checkbox' checked={tempFilter.dueOverdue} readOnly />
                    <label>Overdue</label>
                </div>

                <div onClick={() => setTempFilter(prev => ({
                    ...prev,
                    dueTomorrow: !prev.dueTomorrow,
                    dueThisWeek: false,
                    dueThisMonth: false,
                }))}>
                    <input type='checkbox' checked={tempFilter.dueTomorrow} readOnly />
                    <label>Due tomorrow</label>
                </div>

                <div onClick={() => setTempFilter(prev => ({
                    ...prev,
                    dueTomorrow: false,
                    dueThisWeek: !prev.dueThisWeek,
                    dueThisMonth: false,
                }))}>
                    <input type='checkbox' checked={tempFilter.dueThisWeek} readOnly />
                    <label>Due this week</label>
                </div>

                <div onClick={() => setTempFilter(prev => ({
                    ...prev,
                    dueTomorrow: false,
                    dueThisWeek: false,
                    dueThisMonth: !prev.dueThisMonth,
                }))}>
                    <input type='checkbox' checked={tempFilter.dueThisMonth} readOnly />
                    <label>Due this month</label>
                </div>
            </div>

            <div className={styles.resetButton}>
                <Button 
                    name='Reset Filters' 
                    color='blue' 
                    onClick={() => {
                        setTempFilter({
                            cardStatusCompleted: false,
                            cardStatusNotCompleted: false,
                            priorityHigh: false,
                            priorityMedium: false,
                            priorityLow: false,
                            dueOverdue: false,
                            dueTomorrow: false,
                            dueThisWeek: false,
                            dueThisMonth: false,
                        });
                    }} 
                />
            </div>
        </HoverOptionsPanel>
    ); 
}