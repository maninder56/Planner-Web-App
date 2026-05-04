import { panelType } from '@/app/dashboard/Types/UIState';
import { useEffect, useRef, useState } from 'react';

import styles from './dashboardSearchButton.module.css'; 
import CloseButton from '@/Components/Buttons/closeButton';
import Image from 'next/image';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import SearchBar from '@/Components/Inputs/Search/searchBar';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import LoadingCircle from '@/Components/LoadingCircle/loadingCircle';
import { useUserStore } from '@/Store/userStore';
import { CardSearchResult } from '@/app/dashboard/Types/cardTypes';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { SearchCardByKeywordRequest } from '@/app/dashboard/Services/cardService';

export default function DashboardSearchButton() {
    const isPanelOpen = useBoardUIStore((state) => state.activePanel === 'searchButtonPanel'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 

    const [loading, setLoading] = useState(true); 
    const [searchResults, setSearchResults] = useState<CardSearchResult | undefined>(); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [searchInput, setSearchInput] = useState(''); 

    const debounceTimmerRef = useRef<NodeJS.Timeout | null>(null); 
    const inputRef = useRef<HTMLInputElement>(null); 

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
            setActivePanel('none'); 
            setSessionExpired(true); 
        } else if (!request.ok && request.error === 'NotFound') {
            setSearchResults({searchResults: []}); 
        } else {
            setSearchResults(undefined); 
        }
    }



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
                                setValue={(newValue) => handleSearch(newValue)} />
                        </div>
                        {
                            searchInput.length > 0 ? 
                            <div className={styles.resultsWrapper}>
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
                            :null
                        }
                    </div>
                </div>
                :null
            }
        </>
    ); 
}
