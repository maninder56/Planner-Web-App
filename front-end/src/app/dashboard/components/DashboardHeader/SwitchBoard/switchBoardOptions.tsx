'use client'; 

import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './switchBoardOptions.module.css'; 
import { switchBoardItem } from '@/Types/board';
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import SearchBar from '@/Components/Inputs/Search/searchBar';
import SwitchBoardOptionsLoadingSkeleton from './SwitchBoardOptionsLoadingSkeleton/SwitchBoardOptionsLoadingSkeleton';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { GetAllBoardsRequest, GetBoardRequest, UpdateLastUsedBoardRequest } from '@/app/dashboard/Services/boardService';
import { BoardArray } from '@/app/dashboard/Types/boardTypes';
import Button from '@/Components/Buttons/button';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { NormaliseBoardData } from '@/app/dashboard/Utilities/boardData';
import { useUserStore } from '@/Store/userStore';
import { SignalRServerMethod } from '@/app/dashboard/Types/signalRTypes';
import dynamic from 'next/dynamic';
import { signalRService } from '@/app/dashboard/Services/signalRService';
import { useSignalR } from '@/app/dashboard/Context/signalRContext';


type BoardsState = {
    owned: BoardArray, 
    member: BoardArray, 
    viewer: BoardArray, 
    numberOfTotalBoards: number,
}; 

export default function SwitchBoardOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const errorMessage = useBoardUIStore((state) => state.switchBoardOptionsErrorMessage); 
    const setErrorMessage = useBoardUIStore((state) => state.setSwitchBoardOptionsErrorMessage); 

    const setBoardLoading = useBoardStore((state) => state.setBoardLoading); 
    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const boards = useBoardStore((state) => state.boards); 
    const removeBoardFromBoardArray = useBoardStore((state) => state.RemoveBoardFromBoardArray); 
    const setBoards = useBoardStore((state) => state.setBoards); 
    const setLastUsedBoardExists = useBoardStore((state) => state.setLastUsedBoardExists); 
    const currentBoardData = useBoardStore((state) => state.currentBoardData); 

    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [loading, setLoading] = useState(false); 
    const [failedToLoadBoards, setFailedToLoadBoards] = useState(false); 
    const [searchInput, setSearchInput] = useState(''); 

    const boardsState: BoardsState = splitBoardArrayIntoGroups(boards); 
    const filteredBoards = filterBoards(searchInput, boardsState); 
    
    const favouriteBoardStar = <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.245 4.174c.232-.666.347-.999.518-1.091a.5.5 0 0 1 .475 0c.171.092.287.425.518 1.091l1.53 4.402c.066.19.1.285.159.355a.5.5 0 0 0 .195.142c.085.034.185.036.386.04l4.66.096c.705.014 1.057.021 1.198.155a.5.5 0 0 1 .146.452c-.035.191-.315.404-.877.83l-3.714 2.816c-.16.12-.24.181-.289.26a.5.5 0 0 0-.074.229c-.007.092.022.188.08.38l1.35 4.46c.204.676.306 1.013.222 1.188a.5.5 0 0 1-.384.28c-.193.025-.482-.176-1.06-.579l-3.826-2.662c-.165-.114-.247-.172-.337-.194a.5.5 0 0 0-.24 0c-.09.022-.173.08-.337.194L7.718 19.68c-.579.403-.868.604-1.06.578a.5.5 0 0 1-.385-.279c-.084-.175.018-.512.222-1.187l1.35-4.461c.058-.192.087-.288.08-.38a.5.5 0 0 0-.074-.23c-.049-.078-.128-.138-.288-.26l-3.714-2.815c-.562-.426-.843-.639-.878-.83a.5.5 0 0 1 .147-.452c.14-.134.493-.141 1.198-.155l4.66-.095c.2-.005.3-.007.386-.041a.5.5 0 0 0 .195-.142c.059-.07.092-.165.158-.355z" 
                                        fill="gold" stroke="#000" />
                                </svg>

    

    function filterBoards(search: string, boards: BoardsState): BoardsState {

        if (boards.numberOfTotalBoards === 0 || search.trim() === '') {
            return boards; 
        }

        const searchLower = search.trim().toLowerCase(); 

        const filterArray = (arr: BoardArray) => 
            arr.filter(b => b.name.toLowerCase().includes(searchLower)); 

        const owner = filterArray(boards.owned); 
        const member = filterArray(boards.member); 
        const viewer = filterArray(boards.viewer); 
        const numberOfTotalBoards = owner.length + member.length + viewer.length; 

        return {
            owned: owner, 
            member: member, 
            viewer: viewer, 
            numberOfTotalBoards: numberOfTotalBoards,
        }
    }

    function splitBoardArrayIntoGroups(array: BoardArray | null): BoardsState {
        const ownedBoards: BoardArray = []; 
        const memberBoards: BoardArray = []; 
        const viewerBoards: BoardArray = []; 
        const numberOfTotalBoards = 0; 

        if (array === null) {
            return {
                owned: ownedBoards, 
                member: memberBoards, 
                viewer: viewerBoards,
                numberOfTotalBoards: numberOfTotalBoards,
            }
        }

        for (let item of array) {
            switch(item.role) {
                case 'Owner': 
                    ownedBoards.push(item); 
                    break; 
                
                case 'Member': 
                    memberBoards.push(item); 
                    break; 
                
                case 'Viewer': 
                default: 
                    viewerBoards.push(item); 
            }
        }

        return {
            owned: ownedBoards, 
            member: memberBoards, 
            viewer: viewerBoards,
            numberOfTotalBoards: array.length,
        }; 
    }


    async function handleBoardClick(boardId: number) {
        if (currentBoardData !== undefined  && currentBoardData.id === boardId) {
            setActivePanel('none');     
            return; 
        }

        setBoardLoading(true); 
        
        try {
            const result = await ApiRequestWithRefreshTokenAttemptAndData(GetBoardRequest, boardId); 

            if (result.ok && result.data !== undefined) {
                hydrateBoard(NormaliseBoardData(result.data)); 
                setLastUsedBoard(boardId); 
                setErrorMessage(undefined); 
                setActivePanel('none');    
            } else if (!result.ok && result.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else if (!result.ok && result.error === 'NotFound') {
                setErrorMessage('Board no longer exists, please select different board.'); 
                removeBoardFromBoardArray(boardId); 
            } else {
                setErrorMessage('Failed to switch board, Please try again.'); 
            }

        } finally {
            setBoardLoading(false); 
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

    function handleCloseButton() {
        setActivePanel('none'); 
        setErrorMessage(undefined); 
    }

    async function fetchBoardData() {
        setLoading(true);    
        setFailedToLoadBoards(false); 

        
        try {
            const result = await ApiRequestWithRefreshTokenAttempt(GetAllBoardsRequest); 
            if (result.ok && result.data !== undefined) {
                setBoards(result.data);                 
            } else if (!result.ok && result.error === 'NotFound') {
                setBoards([]);  
            } else if (!result.ok && result.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else {
                setBoards([]); 
                setFailedToLoadBoards(true);
            }
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        if (boards === null) {
            fetchBoardData();  
        }
    }, []); 

    if (loading) {
        return (
            <BigHoverPanel title='Switch board' onCloseClick={handleCloseButton}>
                <SwitchBoardOptionsLoadingSkeleton />
            </BigHoverPanel>
        ); 
    }

    if (failedToLoadBoards) {  
        return (
            <BigHoverPanel title='Switch board' onCloseClick={handleCloseButton}>
                <div className={styles.failedToLoadBoards}>
                    <header>Failed to load boards, Please try again.</header>
                    <Button name='Try again' color='red' onClick={fetchBoardData} />
                </div>
            </BigHoverPanel>
        ); 
    }

    if (boards !== null && boards.length === 0) {
        return (
            <BigHoverPanel title='Switch board' onCloseClick={handleCloseButton}>
                <div className={styles.noBoardsAvailable}>
                    <header>No Boards Available</header>
                    <p>You don’t have any boards yet. Create a new board or ask your team to share one with you.</p>
                </div>
            </BigHoverPanel>
        ); 
    }
    

    return (
        <BigHoverPanel title='Switch board' onCloseClick={handleCloseButton}>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <div className={styles.search}>
                <SearchBar
                    disabled={loading}
                    value={searchInput}
                    setValue={(newValue) => setSearchInput(newValue)} />
            </div>
            {
                filteredBoards.numberOfTotalBoards !== 0 ? null : 
                <div className={styles.noBoardsFound}>
                    <header>No boards found</header>
                    <p>We couldn’t find any boards matching your search. Try a different name or check your spelling.</p>
                </div>
            }
            {
                filteredBoards.owned.length === 0 ? null : 
                <>
                <header className={styles.groupHeader}>Manage these boards</header>
                <div className={styles.boards}>
                    {
                        filteredBoards.owned.map((b) => 
                            <div key={b.boardId} className={styles[b.backgroundColour]}
                                onClick={() => handleBoardClick(b.boardId)}>
                                {b.isFavoriteBoard && favouriteBoardStar}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                </>
            }
            {
                filteredBoards.member.length === 0 ? null : 
                <>
                <header className={styles.groupHeader}>Collaborate on these boards</header>
                <div className={styles.boards}>
                    {
                        filteredBoards.member.map((b) =>    
                            <div key={b.boardId} className={styles[b.backgroundColour]}
                                onClick={() => handleBoardClick(b.boardId)}>
                                {b.isFavoriteBoard && favouriteBoardStar}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                </>
            }
            {
                filteredBoards.viewer.length === 0 ? null : 
                <>
                <header className={styles.groupHeader}>View these boards</header>
                <div className={styles.boards}>
                    {
                        filteredBoards.viewer.map(b => 
                            <div key={b.boardId} className={styles[b.backgroundColour]}
                                onClick={() => handleBoardClick(b.boardId)}>
                                {b.isFavoriteBoard && favouriteBoardStar}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                </>
            }
        </BigHoverPanel>
    ); 
}