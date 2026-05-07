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
import { GetBoardRequest, UpdateLastUsedBoardRequest } from '@/app/dashboard/Services/boardService';
import { NormaliseBoardData } from '@/app/dashboard/Utilities/boardData';

export default function DashboardSearchBar() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const [searchInput, setSearchInput] = useState(''); 
    const [loading, setLoading] = useState(true); 
    const [searchResults, setSearchResults] = useState<CardSearchResult | undefined>(); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const boardDetails = useBoardStore((state) => state.currentBoardData); 
    const setCardDetailsPanelData = useBoardUIStore((state) => state.setCardDetailsPanelData); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setBoardLoading = useBoardStore((state) => state.setBoardLoading); 
    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const setLastUsedBoardExists = useBoardStore((state) => state.setLastUsedBoardExists); 

    const [errorMessage, setErrorMessage] = useState(''); 

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
            setErrorMessage(''); 
            setSearchResults(request.data); 
        } else if (!request.ok && request.error === 'Unauthorized') {
            setSessionExpired(true); 
        } else if (!request.ok && request.error === 'NotFound') {
            setSearchResults({searchResults: []}); 
            setErrorMessage(''); 
        } else {
            setSearchResults(undefined); 
            setErrorMessage('Failed to search, please try again later.'); 
        }
    }

    async function handleCardClick(cardDetails: {
        boardId: number;
        cardId: number;
        listId: number;
        cardName: string;
        boardName: string;
        listName: string;
    }) {
        if (boardDetails && cardDetails.boardId === boardDetails.id) {
            setSearchInput(''); 
            setSearchResults(undefined); 
            setErrorMessage(''); 
            setCardDetailsPanelData({
                parentListId: `list-${cardDetails.listId}`, 
                cardId: `card-${cardDetails.cardId}`
            }); 
            setActivePanel('cardDetailsPanel'); 
        } else {
            try {
                setBoardLoading(true); 
                const boardDataRequest = await ApiRequestWithRefreshTokenAttemptAndData(GetBoardRequest, cardDetails.boardId); 

                if (boardDataRequest.ok && boardDataRequest.data !== undefined) {
                    hydrateBoard(NormaliseBoardData(boardDataRequest.data)); 
                    setSearchInput(''); 
                    setSearchResults(undefined); 
                    setErrorMessage(''); 
                    setCardDetailsPanelData({
                        parentListId: `list-${cardDetails.listId}`, 
                        cardId: `card-${cardDetails.cardId}`
                    }); 
                    setActivePanel('cardDetailsPanel'); 
                    setLastUsedBoard(boardDataRequest.data.boardId); 
                } else if (!boardDataRequest.ok && boardDataRequest.error === 'Unauthorized') {
                    setSessionExpired(true); 
                } else {
                    setErrorMessage('Failed to load board data, please try again later.'); 
                }

            } finally {
                setBoardLoading(false); 
            }
        }
    }

    async function setLastUsedBoard(boardId: number) {
        const lastUsedBoardResult =  await ApiRequestWithRefreshTokenAttemptAndData(
            UpdateLastUsedBoardRequest, boardId); 

        if (lastUsedBoardResult.ok) {
            setLastUsedBoardExists(true); 
        } else if (!lastUsedBoardResult.ok && lastUsedBoardResult.error === 'Unauthorized') {
            setSessionExpired(true); 
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current && !wrapperRef.current.contains(event.target as Node)
            ) {
                setSearchInput(''); 
                setSearchResults(undefined); 
                setErrorMessage(''); 
            }
        }

        document.addEventListener('mousedown', handleClickOutside); 

        return () => {
            document.removeEventListener('mousedown', handleClickOutside); 
        }; 

    }, [])



    return (
        <div className={styles.searchWrapper}
            ref={wrapperRef}
            onClick={(e) => {
                e.stopPropagation(); 
            }}>
            <div className={styles.search}>
                <SearchBar
                    maxLenght={100}
                    value={searchInput}
                    disabled={isBoardLoading}
                    setValue={(newValue) => handleSearch(newValue)} />
            </div>
            {
                searchInput.length > 0 ?
                <div className={styles.searchResultsWrapper} onClick={(e) => {
                    e.stopPropagation(); 
                }}>
                    <header>Search results</header>
                    <div className={styles.error}>{errorMessage}</div>
                    {
                        loading ? 
                        <div className={styles.loading}>
                            <LoadingCircle colour='grey' />
                        </div>
                        : 
                        <div className={styles.results}>
                            {
                                searchResults === undefined ? null
                                :
                                searchResults.searchResults.length === 0 ? 
                                <div className={styles.cardNotFound}>We couldn't find anything matching your search.</div>
                                : 
                                <div className={styles.resultList}>
                                    {searchResults.searchResults.map((cardDetails) => 
                                        <div key={cardDetails.cardId} onClick={() => handleCardClick(cardDetails)}>
                                            <span className={styles.cardName}>{cardDetails.cardName}</span>
                                            <span className={styles.cardInfo}>{cardDetails.boardName}: {cardDetails.listName}</span>
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