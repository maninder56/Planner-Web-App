
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './switchBoardOptions.module.css'; 
import { switchBoardItem } from '@/Types/board';
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import SearchBar from '@/Components/Inputs/Search/searchBar';
import SwitchBoardOptionsLoadingSkeleton from './SwitchBoardOptionsLoadingSkeleton/SwitchBoardOptionsLoadingSkeleton';


export default function SwitchBoardOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const [loading, setLoading] = useState(true); 

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
        {
            name: 'This is going to be a long name of the board, This is going to be a long name of the board, This is going to be a long name of the board', 
            colour: 'light-purple',
        }
    ]; 

    useEffect(() => {
        async function fetchData() {
            
        }; 

        fetchData(); 
    }, [])

    return (
        <BigHoverPanel title='Switch board' onCloseClick={() => setActivePanel('none') }>
            <div className={styles.search}>
            <SearchBar
                disabled={loading}
                value={searchInput}
                setValue={(newValue) => setSearchInput(newValue)} />
            </div>
            {
                loading ? 
                <SwitchBoardOptionsLoadingSkeleton />
                : 
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
            }
        </BigHoverPanel>
    ); 
}