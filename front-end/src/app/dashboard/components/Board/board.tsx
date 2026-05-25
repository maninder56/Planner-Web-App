
import { useEffect, useState } from 'react';
import { LastUsedBoardRequest } from '../../Services/boardService';
import { useBoardStore } from '../../Store/boardStore';
import { NormaliseBoardData } from '../../Utilities/boardData';
import styles from './board.module.css'; 
import BoardContent from './BoardContent/boardContent';
import BoardHeaderBar from './BoardHeader/boardHeaderBar';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { useBoardUIStore } from '../../Store/boardUIStore';
import SignalRInvitationProvider from '../../providers/signalRInvitationProvider';
import dynamic from 'next/dynamic';

export default function Board() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const setBoardLoading = useBoardStore((state) => state.setBoardLoading); 
    const setLastUsedBoardExists = useBoardStore((state) => state.setLastUsedBoardExists); 
    const lastBoardExists = useBoardStore((state) => state.lastUsedBoardExists); 
    const boardError = useBoardStore((state) => state.boardError); 
    const userRole = useBoardStore((state) => state.currentBoardData?.role); 


    // signalR library uses require which turbopack can't statically analyze. 
    // use of dynamic is to make sure the module is rendered only on client side
    const SignalRInvitationProvider = dynamic(
        () => import('../../providers/signalRInvitationProvider'),
        { ssr: false }
    );

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
            {
                userRole !== undefined && userRole === 'Viewer' &&
                <div className={styles.viewOnlyBoard}>
                    <svg width="50" height="50" viewBox="0 0 1.5 1.5" xmlns="http://www.w3.org/2000/svg">
                        <path d="m0.205 0.139 1.156 1.156a0.047 0.047 0 1 1 -0.066 0.066L0.875 0.941 0.566 1.25a0.141 0.141 0 0 1 -0.062 0.036l-0.32 0.087a0.047 0.047 0 0 1 -0.058 -0.058l0.087 -0.32a0.141 0.141 0 0 1 0.036 -0.062L0.559 0.625 0.139 0.205a0.047 0.047 0 1 1 0.066 -0.066M0.625 0.691 0.316 1a0.05 0.05 0 0 0 -0.01 0.015l-0.002 0.006 -0.066 0.241 0.241 -0.066a0.05 0.05 0 0 0 0.016 -0.008L0.5 1.184 0.809 0.875zm0.373 -0.506a0.224 0.224 0 0 1 0.325 0.307l-0.009 0.01 -0.307 0.307 -0.066 -0.066L1.121 0.563 0.938 0.379l-0.18 0.18 -0.066 -0.066zm0.066 0.066 -0.061 0.061L1.188 0.496l0.061 -0.061a0.13 0.13 0 0 0 -0.184 -0.184" 
                            fill="#212121"/>
                    </svg>
                    <span>View only</span>
                </div>
            }
            <span className={styles.error}>{boardError}</span>
            <SignalRInvitationProvider>
                <section>
                    <BoardHeaderBar />
                </section>
                <section>
                    <BoardContent />
                </section>
            </SignalRInvitationProvider>
        </main>
    ); 
}