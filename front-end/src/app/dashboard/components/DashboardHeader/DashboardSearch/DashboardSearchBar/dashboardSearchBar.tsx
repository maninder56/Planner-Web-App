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
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { SearchCardByKeywordRequest } from '@/app/dashboard/Services/cardService';
import { useUserStore } from '@/Store/userStore';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';

export default function DashboardSearchBar() {
    const activePanel = useBoardUIStore((state) => state.activePanel); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const [searchInput, setSearchInput] = useState(''); 
    const [loading, setLoading] = useState(true); 
    const [searchResults, setSearchResults] = useState<CardSearchResult | undefined>(); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const debounceTimmerRef = useRef<NodeJS.Timeout | null>(null); 
    const wrapperRef = useRef<HTMLDivElement | null>(null); 
    
    async function handleSearch(value: string) {
        setSearchInput(value); 
        setLoading(true); 

        if (value.trim() === '') {
            setSearchResults({searchResults: []}); 
            return; 
        }

        if (debounceTimmerRef.current) {
            clearTimeout(debounceTimmerRef.current); 
        }

        debounceTimmerRef.current = setTimeout(async () => {
            await searchRequest(value.trim()); 
            setLoading(false); 
        }, 800);
    }

    async function searchRequest(search: string) {
        const request = await ApiRequestWithRefreshTokenAttemptAndData(SearchCardByKeywordRequest, search); 

        if (request.ok && request.data !== undefined) {
            setSearchResults(request.data); 
        } else if (!request.ok && request.error === 'Unauthorized') {
            setSessionExpired(true); 
        } else if (!request.ok && request.error === 'NotFound') {
            setSearchResults({searchResults: []}); 
        } else {
            setSearchResults(undefined); 
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current && !wrapperRef.current.contains(event.target as Node)
            ) {
                setActivePanel('none'); 
                setSearchInput(''); 
                setSearchResults(undefined); 
            }
        }

        document.addEventListener('mousedown', handleClickOutside); 

        return () => {
            document.removeEventListener('mousedown', handleClickOutside); 
        }; 

    }, [activePanel])



    return (
        <div className={styles.searchWrapper}
            ref={wrapperRef}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('globalSearchBarPanel'); 
            }}>
            <div className={styles.search}>
                <SearchBar
                    maxLenght={100}
                    value={searchInput}
                    disabled={isBoardLoading}
                    setValue={(newValue) => handleSearch(newValue)} />
            </div>
            {
                (searchInput.length > 0 && activePanel === 'globalSearchBarPanel') ?
                <div className={styles.searchResultsWrapper} onClick={(e) => {
                    e.stopPropagation(); 
                }}>
                    <header>Search results</header>
                    {
                        loading ? 
                        <div className={styles.loading}>
                            <LoadingCircle colour='grey' />
                        </div>
                        : 
                        <div className={styles.results}>
                            {
                                searchResults === undefined ? 
                                <div className={styles.error}>Failed to search, please try again later.</div>
                                :
                                searchResults.searchResults.length === 0 ? 
                                <div className={styles.cardNotFound}>We couldn't find anything matching your search.</div>
                                : 
                                <div className={styles.resultList}>
                                    {searchResults.searchResults.map((r) => 
                                        <div key={r.cardId}>
                                            <span className={styles.cardName}>{r.cardName}</span>
                                            <span className={styles.cardInfo}>{r.boardName}: {r.listName}</span>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    }
                </div>
                : null
            }
        </div>
    ) ;
}