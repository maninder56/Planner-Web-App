
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import styles from './onlineUsersButton.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import OnlineUsersButtonOptions from './onlineUsersButtonOptions';

export default function OnlineUsersButton() {
    const isOnlineUsersOptionsOpen = useBoardUIStore((state) => state.activePanel === 'onlineUsersOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isOnlineUsersOptionsOpen ? 'none' : 'onlineUsersOptions'); 
                }}>
                {/* online users logo */}
                <svg width="50" height="50" viewBox="0 0 1.5 1.5" fill="none">
                    <path d="M1.188.938a.25.25 0 0 1 .25.25v.125h-.125M1 .68a.25.25 0 0 0 0-.484M.313.938a.25.25 0 0 0-.25.25v.125h1v-.125a.25.25 0 0 0-.25-.25h-.25m0-.75A.25.25 0 1 0 .78.313" 
                        stroke="#ffffff" strokeWidth=".094" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            { isOnlineUsersOptionsOpen && <OnlineUsersButtonOptions /> }
        </div>
    ); 
}