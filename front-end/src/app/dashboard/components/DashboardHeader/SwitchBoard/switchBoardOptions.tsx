
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

type BoardsState = {
    owned: BoardArray, 
    member: BoardArray, 
    viewer: BoardArray, 
}; 

export default function SwitchBoardOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const [loading, setLoading] = useState(true); 

    const [searchInput, setSearchInput] = useState(''); 

    const [boards, setBoards] = useState<BoardsState>({
        owned: [], member: [], viewer: []
    });

    function splitBoardArrayIntoGroups(array: BoardArray) {
        const ownedBoards: BoardArray = []; 
        const memberBoards: BoardArray = []; 
        const viewerBoards: BoardArray = []; 

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
            ownedBoards: ownedBoards, 
            memberBoards: memberBoards, 
            viewerBoards: viewerBoards,
        }; 
    }

    // useEffect(() => {
    //     async function fetchData() {
    //         const result = await ApiRequestWithRefreshTokenAttempt(GetAllBoardsRequest); 

    //         if (result.ok) {
    //             if (result.data !== undefined) {

    //             }
    //         }

    //     }; 

    //     fetchData(); 
    // }, [])

    if (loading) {
        return (
            <BigHoverPanel title='Switch board' onCloseClick={() => setActivePanel('none') }>
                <SwitchBoardOptionsLoadingSkeleton />
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
                <div className={styles.boards}>
                    <header>Your Boards</header>
                    {
                        boards.owned.map((b) => 
                            <div key={b.boardId} className={styles[b.backgroundColour]}>
                                {b.isFavoriteBoard && <span>star svg</span>}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                : null
            }
            {
                boards.member.length > 0 ? 
                <div className={styles.boards}>
                    <header>Your Boards</header>
                    {
                        boards.member.map((b) =>    
                            <div key={b.boardId} className={styles[b.backgroundColour]}>
                                {b.isFavoriteBoard && <span>star svg</span>}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                : null
            }
            {
                boards.member.length > 0 ? 
                <div className={styles.boards}>
                    <header>Your Boards</header>
                    {
                        boards.viewer.map(b => 
                            <div key={b.boardId} className={styles[b.backgroundColour]}>
                                {b.isFavoriteBoard && <span>star svg</span>}
                                <span>{b.name}</span>
                            </div>
                        )
                    }
                </div>
                : null
            }
        </BigHoverPanel>
    ); 
}