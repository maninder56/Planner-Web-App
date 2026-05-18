
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import styles from './inboxButton.module.css'; 
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useInvitationStore } from '@/app/dashboard/Store/invitationStore';

export default function InboxButton() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const invitations = useInvitationStore((state) => state.invitations); 

    const numberOfInvitations = () => {
        if (invitations.length === 0) {
            return  <sup></sup>; 
        } else if (invitations.length > 9) {
            return <sup>+9</sup>; 
        } else {
            return <sup>{invitations.length}</sup>; 
        }
    }  

    return (
        <button className={styles.wrapper} disabled={isBoardLoading} onClick={e => {
            e.stopPropagation(); 
            setActivePanel('inboxOptionsPanel'); 
        }}>
            <svg width="20" height="20" viewBox="0 0 240 240" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
                <path d="M220 120h-60l-20 30h-40l-20-30H20"/>
                <path d="M54.5 51.1 20 120v60a20 20 0 0 0 20 20h160a20 20 0 0 0 20-20v-60l-34.5-68.9A20 20 0 0 0 167.6 40H72.4a20 20 0 0 0-17.9 11.1"/>
            </svg>
            {numberOfInvitations()}
            <span>Inbox</span>
        </button>
    ); 
}