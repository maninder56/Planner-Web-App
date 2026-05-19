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
import { GetBoardRequest, UpdateLastUsedBoardRequest } from '@/app/dashboard/Services/boardService';
import { NormaliseBoardData } from '@/app/dashboard/Utilities/boardData';

export default function DashboardSearchButton() {
    const isPanelOpen = useBoardUIStore((state) => state.activePanel === 'searchButtonPanel'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const [searchInput, setSearchInput] = useState(''); 

    const [loading, setLoading] = useState(true); 
    const [searchResults, setSearchResults] = useState<CardSearchResult | undefined>(); 
    
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const boardDetails = useBoardStore((state) => state.currentBoardData); 
    const setCardDetailsPanelData = useBoardUIStore((state) => state.setCardDetailsPanelData); 
    const setBoardLoading = useBoardStore((state) => state.setBoardLoading); 
    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const setLastUsedBoardExists = useBoardStore((state) => state.setLastUsedBoardExists); 

    const [errorMessage, setErrorMessage] = useState(''); 

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
            setErrorMessage(''); 
            setSearchResults(request.data); 
        } else if (!request.ok && request.error === 'Unauthorized') {
            setActivePanel('none'); 
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
        if (isPanelOpen && inputRef.current) {
            inputRef.current.focus(); 
        }
    }, [isPanelOpen]);

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
                            :null
                        }
                    </div>
                </div>
                :null
            }
        </>
    ); 
}
