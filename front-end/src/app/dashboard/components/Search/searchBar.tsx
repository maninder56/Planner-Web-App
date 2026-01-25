'use client'


import styles from '@/app/dashboard/components/Search/searchBar.module.css'; 
import { panelType } from '@/Types/UIState';
import Image from 'next/image';
import { useState } from 'react';

export default function SearchBar({
    activePanel, 
    setActivePanel,
}: {
    activePanel: panelType; 
    setActivePanel: (panel: panelType) => void; 
}) {
    const [searchInput, setSearchInput] = useState(''); 

    const mockResults = ['Edit css to match brand', 'improve search functionality']; 

    return (
        <div className={styles.searchWrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('search') 
            }}>
            <div className={styles.search}>
                <Image src={'./search-icon.svg'} alt='search icon' width={30} height={30} />
                <input
                    type='text'
                    placeholder='Search' 
                    maxLength={100}
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}/>
            </div>
            {
                activePanel === 'search' ?
                <div className={styles.searchResultsWrapper}>
                    <p>Search results</p>
                    <div className={styles.results}>
                        {mockResults.map((r, i) => <p key={i}>{r}</p>)}
                    </div>
                </div>
                : null   
            }
        </div>
    ) ;
}