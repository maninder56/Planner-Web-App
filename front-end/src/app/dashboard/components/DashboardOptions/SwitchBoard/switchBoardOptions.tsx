
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './switchBoardOptions.module.css'; 
import { switchBoardItem } from '@/Types/board';
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import SearchBar from '../../Search/SearchBar/searchBar';
import Image from 'next/image';
import { useState } from 'react';


export default function SwitchBoardOptions() {
    const [activePanel, setActivePanel] = useActivePanel(); 

    const [searchInput, setSearchInput] = useState(''); 

    // temporary boards info 
    const boards: switchBoardItem[] = [
        {
            name: 'My first Board', 
            colour: 'soft-pink'
        }, 
        {
            name: 'recipe app', 
            colour: 'light-mint-green'
        }, 
        {
            name: 'planner web app', 
            colour: 'lavender-blue'
        }, 
        {
            name: 'Ocean Notes',
            colour: 'aqua',
        },
        {
            name: 'Design Ideas',
            colour: 'light-purple',
        },
        {
            name: 'Marketing Campaign',
            colour: 'bright-pink',
        },

        // optional: duplicates to see repetition / UI scaling
        {
            name: 'Daily Tasks',
            colour: 'soft-pink',
        },
        {
            name: 'Fitness Tracker',
            colour: 'aqua',
        },
    ]; 

    return (
        <BigHoverPanel title='Switch board' onCloseClick={() => setActivePanel('none') }>
            <div className={styles.search}>
                <Image src={'./search-icon.svg'} alt='search icon' width={30} height={30} />
                <input
                    type='text'
                    placeholder='Search' 
                    maxLength={100}
                    value={searchInput}
                    // onFocus={() => setSearchFocused(true)}
                    // onBlur={() => setSearchInput('')}
                    onChange={e => setSearchInput(e.target.value)}/>
            </div>
            <div className={styles.boards}>
                {
                    boards.map((b, i) => {
                        return (
                            <div key={i} className={styles[b.colour]}>
                                <span>{b.name}</span>
                            </div>
                        ); 
                    })
                }
            </div>
        </BigHoverPanel>
    ); 
}