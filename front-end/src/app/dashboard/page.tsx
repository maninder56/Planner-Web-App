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

export default function Dashboard() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isSessionExpired = useUserStore((state) => state.sessionExpired);  

    // signalR library uses require which turbopack can't statically analyze. 
    // use of dynamic is to make sure the module is rendered only on client side
    const SignalRInvitationProvider = dynamic(
        () => import('./providers/signalRInvitationProvider'),
        { ssr: false }
    );

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
