
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './switchBoardOptions.module.css'; 
import { switchBoardItem } from '@/Types/board';
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import SearchBar from '@/Components/Inputs/Search/searchBar';
import SwitchBoardOptionsLoadingSkeleton from './SwitchBoardOptionsLoadingSkeleton/SwitchBoardOptionsLoadingSkeleton';
import { ApiRequestWithRefreshTokenAttempt } from '@/Services/ApiRequest';
import { GetAllBoardsRequest } from '@/app/dashboard/Services/boardService';
import { BoardArray } from '@/app/dashboard/Types/boardTypes';
import Button from '@/Components/Buttons/button';

type BoardsState = {
    owned: BoardArray, 
    member: BoardArray, 
    viewer: BoardArray, 
    numberOfTotalBoards: number,
}; 

export default function SwitchBoardOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const [loading, setLoading] = useState(true); 

    const [searchInput, setSearchInput] = useState(''); 

    const [boards, setBoards] = useState<BoardsState | undefined>();

    function splitBoardArrayIntoGroups(array: BoardArray): BoardsState {
        const ownedBoards: BoardArray = []; 
        const memberBoards: BoardArray = []; 
        const viewerBoards: BoardArray = []; 
        const numberOfTotalBoards = array.length; 

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
            numberOfTotalBoards: numberOfTotalBoards,
        }; 
    }

    async function fetchBoardData() {
        console.log('fetchBoardData called');
        setLoading(true);    
        
        try {
            const result = await ApiRequestWithRefreshTokenAttempt(GetAllBoardsRequest); 
             console.log('API Response:', result);  
            if (result.ok && result.data !== undefined) {
                setBoards(splitBoardArrayIntoGroups(result.data));                 
            } else {
                setBoards(undefined); 
            }
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        console.log('useEffect called');
        fetchBoardData();  
    }, [])

    if (loading) {
        return (
            <BigHoverPanel title='Switch board' onCloseClick={() => setActivePanel('none') }>
                <SwitchBoardOptionsLoadingSkeleton />
            </BigHoverPanel>
        ); 
    }

    if (boards === undefined) {
        return (
            <BigHoverPanel title='Switch board' onCloseClick={() => setActivePanel('none') }>
                <div className={styles.failedToLoadBoards}>
                    <header>Failed to load boards, Please try again.</header>
                    <Button name='Try again' color='red' onClick={fetchBoardData} />
                </div>
            </BigHoverPanel>
        ); 
    }

    if (boards.numberOfTotalBoards === 0) {
        return (
            <BigHoverPanel title='Switch board' onCloseClick={() => setActivePanel('none') }>
                <div className={styles.noBoardsAvailable}>
                    <header>No Boards Available</header>
                    <p>You don’t have any boards yet. Create a new board or ask your team to share one with you.</p>
                </div>
            </BigHoverPanel>
        ); 
    }
    

    return (
        <BigHoverPanel title='Switch board' onCloseClick={() => setActivePanel('none') }>
            <div className={styles.search}>
                <SearchBar
                    disabled={loading}
                    value={searchInput}
                    setValue={(newValue) => setSearchInput(newValue)} />
            </div>
            {
                boards.owned.length > 0 ? 
                <>
                <header>Manage these boards</header>
                <div className={styles.boards}>
                    {
                        boards.owned.map((b) => 
                            <div key={b.boardId} className={styles[b.backgroundColour]}>
                                {b.isFavoriteBoard && <span>star svg</span>}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                </>
                : null
            }
            {
                boards.member.length > 0 ? 
                <>
                <header>Collaborate on these boards</header>
                <div className={styles.boards}>
                    {
                        boards.member.map((b) =>    
                            <div key={b.boardId} className={styles[b.backgroundColour]}>
                                {b.isFavoriteBoard && <span>star svg</span>}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                </>
                : null
            }
            {
                boards.viewer.length > 0 ? 
                <>
                <header>View these boards</header>
                <div className={styles.boards}>
                    {
                        boards.viewer.map(b => 
                            <div key={b.boardId} className={styles[b.backgroundColour]}>
                                {b.isFavoriteBoard && <span>star svg</span>}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                </>
                : null
            }
        </BigHoverPanel>
    ); 
}