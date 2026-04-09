
import { useEffect, useState } from 'react';
import { LastUsedBoardRequest } from '../../Services/boardService';
import { useBoardStore } from '../../Store/boardStore';
import { NormaliseBoardData } from '../../Utilities/boardData';
import styles from './board.module.css'; 
import BoardContent from './BoardContent/boardContent';
import BoardHeaderBar from './BoardHeader/boardHeaderBar';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { useBoardUIStore } from '../../Store/boardUIStore';

export default function Board() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const setBoardLoading = useBoardStore((state) => state.setBoardLoading); 
    const setLastUsedBoardExists = useBoardStore((state) => state.setLastUsedBoardExists); 
    const lastBoardExists = useBoardStore((state) => state.lastUsedBoardExists); 
    const boardError = useBoardStore((state) => state.boardError); 

    async function fetchData() {
        const dataRequest = await ApiRequestWithRefreshTokenAttempt(LastUsedBoardRequest); 
        if (dataRequest.ok) {
            if (dataRequest.data !== undefined) {
                hydrateBoard(NormaliseBoardData(dataRequest.data)); 
                setLastUsedBoardExists(true); 
            }
        } else if (dataRequest.error === 'NotFound') {
            setLastUsedBoardExists(false); 
            setActivePanel('switchBoardOptions'); 
        }

        setBoardLoading(false); 
    }

    useEffect(() => {
        if (!lastBoardExists) {
            fetchData(); 
        }
    }, []); 


    return (
        <main className={styles.mainContent}>
            <span className={styles.error}>{boardError}</span>
            <section>
                <BoardHeaderBar />
            </section>
            <section>
                <BoardContent />
            </section>
        </main>
    ); 
}