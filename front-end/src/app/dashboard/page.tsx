'use client'; 


import styles from './page.module.css'; 
import { useBoardUIStore } from './Store/boardUIStore';
import DashboardHeader from './components/DashboardHeader/dashboardHeader';
import Board from './components/Board/board';
import { useUserStore } from '../../Store/userStore';
import SessionExpired from '@/Components/Alert/SessionExpired/sessionExpired';
import { useInvitationStore } from './Store/invitationStore';
import InvitationBannerNotification from './components/InvitationBannerNotification/InvitationBannerNotification';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import BoardHeaderSkeleton from './components/Board/BoardHeader/BoardHeaderSkeleton/boardHeaderSkeleton';
import BoardContentLoadingSkeleton from './components/Board/BoardContent/BoardContentLoadingSkeleton/boardContentLoadingSkeleton';
import DashboardHeaderLoadingSkeleton from './components/DashboardHeader/DashboardHeaderLoadingSkeleton/dashboardHeaderLoadingSkeleton';
import { RefreshTokensRequest } from '@/Services/ApiRequest';
import DashboardErrorPage from './components/DashboardError/dashboardErrorPage';
import { useBoardStore } from './Store/boardStore';
import DisappearingMessage from '@/Components/Alert/DisappearingMessage/disappearingMessage';

// signalR library uses require which turbopack can't statically analyze. 
    // use of dynamic is to make sure the module is rendered only on client side
const SignalRProvider = dynamic(
    () => import('./providers/signalRProvider'),
    { ssr: false }
);


export default function Dashboard() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isSessionExpired = useUserStore((state) => state.sessionExpired);  
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const boardActivityMessage = useBoardStore((state) => state.boardActivityMessage); 
    const setBoardActivityMessage = useBoardStore((state) => state.setBoardActivityMessage); 
    
    const [loading, setLoading] = useState(true); 
    const [showErrorPage, setShowErrorPage] = useState(false); 


    async function fetchRefrehTokens() {
        const request = await RefreshTokensRequest(); 
        setSessionExpired(false); 

        if (request.ok) {
            setLoading(false); 
        } else if (request.error === 'BadRequest') {
            setSessionExpired(true); 
        } else {
            setLoading(false); 
            setShowErrorPage(true);
        }
    }

    useEffect(() => {
        fetchRefrehTokens(); 
    }, []); 

    function handleTryAgain() {
        setLoading(true); 
        setShowErrorPage(false); 
        fetchRefrehTokens(); 
    }


    if (loading) {
        return (
            <div className={styles.page}
                onClick={(e) => {
                    e.stopPropagation(); 
                    setActivePanel('none'); 
                }}>
                    <DashboardHeaderLoadingSkeleton />
                    <BoardHeaderSkeleton />
                    <BoardContentLoadingSkeleton />
                    { isSessionExpired && <SessionExpired /> }
            </div>
        ); 
    }

    if (showErrorPage) {
        return (
            <DashboardErrorPage onTryAgainClick={handleTryAgain}/>
        );
    }

    return (
        <SignalRProvider>
            <div className={styles.page}
                onClick={(e) => {
                    e.stopPropagation(); 
                    setActivePanel('none'); 
                }}>
                    <DashboardHeader />
                    <div className={styles.disappearingMessage}>
                        <DisappearingMessage message={boardActivityMessage} durationInSeconds={2} setMessage={setBoardActivityMessage} />
                    </div>
                    <Board />   
                    { isSessionExpired && <SessionExpired /> }
                    { <InvitationBannerNotification /> }
            </div>
        </SignalRProvider>
    ); 
}
