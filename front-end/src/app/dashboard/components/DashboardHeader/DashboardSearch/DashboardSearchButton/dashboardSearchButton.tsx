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
            <Image src={'./search-icon.svg'} alt='search icon' width={30} height={30} />
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
