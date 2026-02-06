
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './filterButtonOptions.module.css'; 
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import { useState } from 'react';
import Image from 'next/image';

export default function FilterBoardOptions() {
    const [activePanel, setActivePanel] = useActivePanel(); 

    const [searchInput, setSearchInput] = useState(''); 

    // const [tempState, setTempState] = useState<{}
    

    return (
        <HoverOptionsPanel title='Filter' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.search}>
                <Image src={'./search-icon.svg'} alt='search icon' width={30} height={30} />
                <input
                    type='text'
                    placeholder='Search this board' 
                    maxLength={100}
                    value={searchInput}
                    // onFocus={() => setSearchFocused(true)}
                    // onBlur={() => setSearchInput('')}
                    onChange={e => setSearchInput(e.target.value)}/>
            </div>
            <div className={styles.checkOptions}>
                <header>Card Status</header>
                <div>
                    <input type='checkbox' />
                    <label>Completed</label>
                </div>
                <div>
                    <input type='checkbox' />
                    <label>Not Completed</label>
                </div>
            </div>
            <hr className={styles.hrTag} />
            <div className={styles.checkOptions}>
                <header>Priority</header>
                <div>
                    <input type='checkbox' />
                    <label>High</label>
                </div>
                <div>
                    <input type='checkbox' />
                    <label>Medium</label>
                </div>
                <div>
                    <input type='checkbox' />
                    <label>Low</label>
                </div>
            </div>
            <hr className={styles.hrTag} />
            <div className={styles.dropdownList}>
                <header>By List</header>
                <select>
                    <option value=''>Show all lists</option>
                    <option value='1'>Backlog</option>
                    <option value='2'>In Progress</option>
                    <option value='3'>Done</option>
                </select>
            </div>
            <hr className={styles.hrTag} />
            <div className={styles.checkOptions}>
                <header>Due Date</header>
                <div>
                    <input type='checkbox' />
                    <label>Overdue</label>
                </div>
                <div>
                    <input type='checkbox' />
                    <label>Due tomorrow</label>
                </div>
                <div>
                    <input type='checkbox' />
                    <label>Due this week</label>
                </div>
                <div>
                    <input type='checkbox' />
                    <label>Due this month</label>
                </div>
            </div>
            <div>
                Reset Filters button
            </div>
        </HoverOptionsPanel>
    ); 
}