
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import styles from './onlineUsersButtonOptions.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useUserStore } from '@/Store/userStore';
import { useLayoutEffect, useRef } from 'react';

export default function OnlineUsersButtonOptions() {
    const onlineUsers = useBoardStore((state) => state.onlineUsers);
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const isPanelOpen = useBoardUIStore((state) => state.activePanel === 'onlineUsersOptions'); 
    const optionsPanelRef = useRef<HTMLDivElement | null>(null); 

    useLayoutEffect(() => {
        if (!isPanelOpen || !optionsPanelRef.current?.parentElement) return; 

        // get parent element's position relative to viewport
        const element = optionsPanelRef.current.parentElement; 
        const rect = element.getBoundingClientRect(); 

        // calculate how far is element from right side 
        const offSetRight = window.innerWidth - rect.right; 

        element.style.setProperty('--rightValueForOnlineUsersOptionsPanel', 
            offSetRight > 50 ? `${-105}px`: '0px'); 
    }, []); 

    return (
        <HoverOptionsPanel title='Online Users' offsetZeroTo={'right'} onCloseClick={() => setActivePanel('none')}
            className={styles.hoverPanel} ref={optionsPanelRef}>
            <ul className={styles.wrapper}>
                {[...onlineUsers.values()].map((user) => (
                    <li key={user.userId}>
                        <div>{user.name}</div>
                        <div>{user.email}</div>
                    </li>
                ))}
                <li className={styles.totalUsers}>
                    {/* online users logo */}
                    <svg width="20" height="20" viewBox="0 0 1.5 1.5" fill="none">
                        <path d="M1.188.938a.25.25 0 0 1 .25.25v.125h-.125M1 .68a.25.25 0 0 0 0-.484M.313.938a.25.25 0 0 0-.25.25v.125h1v-.125a.25.25 0 0 0-.25-.25h-.25m0-.75A.25.25 0 1 0 .78.313" 
                            stroke="#000000" strokeWidth=".094" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>{onlineUsers.size} user{onlineUsers.size > 1 ? 's' : null} online</div>
                </li>
            </ul>
        </HoverOptionsPanel>
    ); 
}