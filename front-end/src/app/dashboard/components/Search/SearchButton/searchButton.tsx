import { panelType } from '@/app/dashboard/Types/UIState';
import { useEffect, useRef, useState } from 'react';

import styles from './searchButton.module.css'; 
import CloseButton from '@/Components/Buttons/closeButton';
import Image from 'next/image';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';

export default function SearchButton() {
    const isPanelOpen = useBoardUIStore((state) => state.activePanel === 'searchButtonPanel'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const [searchInput, setSearchInput] = useState(''); 
    const inputRef = useRef<HTMLInputElement>(null); 

    useEffect(() => {
        if (isPanelOpen && inputRef.current) {
            inputRef.current.focus(); 
        }
    }, [isPanelOpen])

    return (
        <div className={styles.wrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                if (!isPanelOpen) {
                    setActivePanel('searchButtonPanel'); 
                }
            }}>
            <Image src={'./search-icon.svg'} alt='search icon' width={30} height={30} />
            <header>Search</header>
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
                            <Image src={'./search-icon.svg'} alt='search icon' width={30} height={30} />
                            <input
                                ref={inputRef}
                                type='text'
                                placeholder='Search'
                                maxLength={100}
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)} />
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
        </div>
    ); 
}
