import { panelType } from '@/app/dashboard/Types/UIState';
import { useEffect, useRef, useState } from 'react';

import styles from './dashboardSearchButton.module.css'; 
import CloseButton from '@/Components/Buttons/closeButton';
import Image from 'next/image';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import SearchBar from '@/Components/Inputs/Search/searchBar';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function DashboardSearchButton() {
    const isPanelOpen = useBoardUIStore((state) => state.activePanel === 'searchButtonPanel'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 

    const [searchInput, setSearchInput] = useState(''); 
    const inputRef = useRef<HTMLInputElement>(null); 

    useEffect(() => {
        if (isPanelOpen && inputRef.current) {
            inputRef.current.focus(); 
        }
    }, [isPanelOpen])

    return (
        <>
        <button className={styles.wrapper}
            disabled={isBoardLoading}
            onClick={(e) => {
                e.stopPropagation(); 
                if (!isPanelOpen) {
                    setActivePanel('searchButtonPanel'); 
                }
            }}>
            <svg fill="none" viewBox="4.75 4.25 15.5 15.5" width="50" height="50">
                <path clipRule="evenodd" d="M5.5 10.766a5.765 5.765 0 1 1 11.53 0 5.765 5.765 0 0 1-11.53 0" 
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.029 16.53 19.5 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <header>Search</header>
        </button>
        {
                isPanelOpen ? 
                <div className={styles.searchPanel}
                    onClick={e => {
                        e.stopPropagation(); 
                    }}>
                    <div className={styles.search}>
                        <div className={styles.closeButton}>
                            <CloseButton onClick={() => {
                                setSearchInput(''); 
                                setActivePanel('none'); 
                                }} />
                        </div>
                        <div className={styles.searchBar}>
                            <SearchBar 
                                inputRef={inputRef}
                                maxLenght={100}
                                value={searchInput}
                                setValue={(newValue) => setSearchInput(newValue)} />
                        </div>
                        {
                            searchInput.length > 0 ? 
                            <div className={styles.resultsWrapper}>
                                <header>Search results</header>
                                <div className={styles.results}>
                                    <p>Edit css to match brand</p>
                                    <p>Improve search functionality</p>
                                </div>
                            </div>
                            :null
                        }
                    </div>
                </div>
                :null
            }
        </>
    ); 
}
