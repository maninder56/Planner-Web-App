'use client'; 


import styles from './page.module.css'; 
import { useBoardUIStore } from './Store/boardUIStore';
import DashboardHeader from './components/DashboardHeader/dashboardHeader';
import Board from './components/Board/board';
import { useUserStore } from '../../Store/userStore';
import SessionExpired from '@/Components/Alert/SessionExpired/sessionExpired';
import SignalRInvitationProvider from './providers/signalRInvitationProvider';
import { useInvitationStore } from './Store/invitationStore';
import InvitationBannerNotification from './components/InvitationBannerNotification/InvitationBannerNotification';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import BoardHeaderSkeleton from './components/Board/BoardHeader/BoardHeaderSkeleton/boardHeaderSkeleton';
import BoardContentLoadingSkeleton from './components/Board/BoardContent/BoardContentLoadingSkeleton/boardContentLoadingSkeleton';
import DashboardHeaderLoadingSkeleton from './components/DashboardHeader/DashboardHeaderLoadingSkeleton/dashboardHeaderLoadingSkeleton';
import { RefreshTokensRequest } from '@/Services/ApiRequest';
import DashboardErrorPage from './components/DashboardError/dashboardErrorPage';

export default function Dashboard() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isSessionExpired = useUserStore((state) => state.sessionExpired);  
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const [loading, setLoading] = useState(true); 
    const [showErrorPage, setShowErrorPage] = useState(false); 

    // signalR library uses require which turbopack can't statically analyze. 
    // use of dynamic is to make sure the module is rendered only on client side
    const SignalRInvitationProvider = dynamic(
        () => import('./providers/signalRInvitationProvider'),
        { ssr: false }
    );

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
        <SignalRInvitationProvider>
            <div className={styles.page}
                onClick={(e) => {
                    e.stopPropagation(); 
                    setActivePanel('none'); 
                }}>
                    <DashboardHeader />
                    <Board />   
                    { isSessionExpired && <SessionExpired /> }
                    { <InvitationBannerNotification /> }
            </div>
        </SignalRInvitationProvider>
    ); 
}
