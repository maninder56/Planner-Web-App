'use client'


import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './dashboardSearchBar.module.css'; 
import { panelType } from '@/app/dashboard/Types/UIState';
import Image from 'next/image';
import { useState } from 'react';
import SearchBar from '@/Components/Inputs/Search/searchBar';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function DashboardSearchBar() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    // const [activePanel, setActivePanel] = useActivePanel(); 
    const [searchInput, setSearchInput] = useState(''); 
    // const [searchFocused, setSearchFocused] = useState(false); 

    const mockResults = ['Edit css to match brand', 'improve search functionality']; 

    return (
        <div className={styles.searchWrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                // if (activePanel !== 'searchBarPanel') {
                //     setActivePanel('searchBarPanel'); 
                // }
            }}>
            <div className={styles.search}>
                <SearchBar
                    maxLenght={100}
                    onBlur={() => setSearchInput('')}
                    value={searchInput}
                    disabled={isBoardLoading}
                    setValue={(newValue) => setSearchInput(newValue)} />
            </div>
            {
                searchInput.length > 0 ?
                <div className={styles.searchResultsWrapper}>
                    <header>Search results</header>
                    <div className={styles.results}>
                        {mockResults.map((r, i) => <p key={i}>{r}</p>)}
                    </div>
                </div>
                : null   
            }
        </div>
    ) ;
}