
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
    numberOfTotalBoards: number,
}; 

export default function SwitchBoardOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const [loading, setLoading] = useState(true); 

    const [searchInput, setSearchInput] = useState(''); 

    const [boards, setBoards] = useState<BoardsState>({
        owned: [], member: [], viewer: [], numberOfTotalBoards: 0,
    });

    function splitBoardArrayIntoGroups(array: BoardArray) {
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
            ownedBoards: ownedBoards, 
            memberBoards: memberBoards, 
            viewerBoards: viewerBoards,
            numberOfTotalBoards: numberOfTotalBoards,
        }; 
    }

    useEffect(() => {
        async function fetchData() {
            // const result = await ApiRequestWithRefreshTokenAttempt(GetAllBoardsRequest); 

            // if (result.ok) {
            //     if (result.data !== undefined) {

            //     }
            // }

            await new Promise(r => setTimeout(r, 3000)); 
            setLoading(false); 
        }; 

        fetchData(); 
    }, [])

    if (loading) {
        return (
            <BigHoverPanel title='Switch board' onCloseClick={() => setActivePanel('none') }>
                <SwitchBoardOptionsLoadingSkeleton />
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
                <div className={styles.boards}>
                    <header>Manage these boards</header>
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
                    <header>Collaborate on these boards</header>
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
                boards.viewer.length > 0 ? 
                <div className={styles.boards}>
                    <header>View these boards</header>
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