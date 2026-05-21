'use client'


import styles from './page.module.css'; 
import { useBoardUIStore } from './Store/boardUIStore';
import DashboardHeader from './components/DashboardHeader/dashboardHeader';
import Board from './components/Board/board';
import { useUserStore } from '../../Store/userStore';
import SessionExpired from '@/Components/Alert/SessionExpired/sessionExpired';
import SignalRInvitationProvider from './providers/signalRInvitationProvider';
import { useInvitationStore } from './Store/invitationStore';
import InvitationBannerNotification from './components/InvitationBannerNotification/InvitationBannerNotification';

export default function Dashboard() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isSessionExpired = useUserStore((state) => state.sessionExpired); 
    const showInvitationReceivedNotification = useInvitationStore((state) => state.showInvitationReceivedNotification); 

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
                    { !showInvitationReceivedNotification && <InvitationBannerNotification /> }
            </div>
        </SignalRInvitationProvider>
    ); 
}
