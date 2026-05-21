'use client'


import styles from './page.module.css'; 
import { useBoardUIStore } from './Store/boardUIStore';
import DashboardHeader from './components/DashboardHeader/dashboardHeader';
import Board from './components/Board/board';
import { useUserStore } from '../../Store/userStore';
import SessionExpired from '@/Components/Alert/SessionExpired/sessionExpired';
import SignalRInvitationProvider from './providers/signalRInvitationProvider';

export default function Dashboard() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isSessionExpired = useUserStore((state) => state.sessionExpired); 

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
            </div>
        </SignalRInvitationProvider>
    ); 
}
