'use client'


import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './dashboardSearchBar.module.css'; 
import { panelType } from '@/app/dashboard/Types/UIState';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import SearchBar from '@/Components/Inputs/Search/searchBar';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { CardSearchResult } from '@/app/dashboard/Types/cardTypes';
import LoadingCircle from '@/Components/LoadingCircle/loadingCircle';

export default function DashboardSearchBar() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    // const [activePanel, setActivePanel] = useActivePanel(); 
    const [searchInput, setSearchInput] = useState(''); 
    const [loading, setLoading] = useState(true); 

    const debounceTimmerRef = useRef<NodeJS.Timeout | null>(null); 
    
    function handleSearch(value: string) {
        setSearchInput(value); 
        setLoading(true); 

        if (debounceTimmerRef.current) {
            clearTimeout(debounceTimmerRef.current); 
        }

        debounceTimmerRef.current = setTimeout(() => {
            setLoading(false); 
            console.log('Search Done'); 
        }, 2000);
    }


    const mockResults: CardSearchResult = {
        "searchResults": [
            {
                "boardId": 37,
                "cardId": 62,
                "cardName": "do to app ",
                "boardName": "dummy",
                "listName": "second list"
            },
            {
                "boardId": 37,
                "cardId": 63,
                "cardName": "do to man",
                "boardName": "dummy",
                "listName": "second list"
            },
            {
                "boardId": 37,
                "cardId": 64,
                "cardName": "do work",
                "boardName": "dummy",
                "listName": "second list"
            }
        ]
    }; 


    return (
        <div className={styles.searchWrapper}
            onClick={(e) => {
                e.stopPropagation(); 
            }}>
            <div className={styles.search}>
                <SearchBar
                    maxLenght={100}
                    onBlur={() => setSearchInput('')}
                    value={searchInput}
                    disabled={isBoardLoading}
                    setValue={(newValue) => handleSearch(newValue)} />
            </div>
            {
                searchInput.length > 0 ?
                <div className={styles.searchResultsWrapper}>
                    <header>Search results</header>
                    {
                        loading ? 
                        <div className={styles.loading}>
                            <LoadingCircle colour='grey' />
                        </div>
                        : 
                        <div className={styles.results}>
                            {mockResults.searchResults.map((r, i) => <p key={i}>{r.cardName}</p>)}
                        </div>
                    }
                </div>
                : null
            }
        </div>
    ) ;
}