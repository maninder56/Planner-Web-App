'use client'


import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './searchBar.module.css'; 
import { panelType } from '@/Types/UIState';
import Image from 'next/image';
import { useState } from 'react';

export default function SearchBar() {
    const [activePanel, setActivePanel] = useActivePanel(); 
    const [searchInput, setSearchInput] = useState(''); 
    // const [searchFocused, setSearchFocused] = useState(false); 

    const mockResults = ['Edit css to match brand', 'improve search functionality']; 

    return (
        <div className={styles.searchWrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                if (activePanel !== 'searchBarPanel') {
                    setActivePanel('searchBarPanel'); 
                }
            }}>
            <div className={styles.search}>
                <Image src={'./search-icon.svg'} alt='search icon' width={30} height={30} />
                <input
                    type='text'
                    placeholder='Search' 
                    maxLength={100}
                    value={searchInput}
                    // onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchInput('')}
                    onChange={e => setSearchInput(e.target.value)}/>
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