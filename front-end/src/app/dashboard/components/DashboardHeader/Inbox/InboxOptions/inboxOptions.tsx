

import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './inboxOptions.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useInvitationStore } from '@/app/dashboard/Store/invitationStore';
import Button from '@/Components/Buttons/button';
import { InvitationStatus } from '@/app/dashboard/Types/invitationTypes';

export default function InboxOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const invitations = useInvitationStore((state) => state.invitations); 

    function formatInviteDate(value: string) {
        const date = new Date(value); 
        if (Number.isNaN(date.getTime())) {
            return "-"; 
        } else {
            return date.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, 
            });
        }
    }

    return (
        <BigHoverPanel title='Inbox' onCloseClick={() => setActivePanel('none')}>
            <ul className={styles.wrapper}>
                {
                    invitations.map(invite => 
                        <li key={invite.id}>
                            <div className={styles.inviteInfo}>
                                <div className={styles.boardName}>{invite.boardName}</div>
                                <div className={styles.invitedBy}>Invited By: {invite.invitedByUserEmail}sdfsdfjlkjlkjlkjlkjsdfsdfsdfsdfsdfsdf</div>
                                <div  className={styles.meta}>
                                    <div className={styles.metaItem}>Status: {invite.status}</div>
                                    <div className={styles.metaItem}>Role: {invite.role}</div>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                {
                                    invite.status !== 'Pending' ? null : 
                                    <div className={styles.buttons}>
                                        <Button name='Accept' color='transparent-with-outline' onClick={() => {}} />
                                        <Button name='Reject' color='red' onClick={() => {}} />
                                    </div>
                                }
                                <div className={styles.expireText}>Expires at: {formatInviteDate(invite.expiresAt)}</div>
                            </div>
                        </li>
                    )
                }
            </ul>
        </BigHoverPanel>
    ); 
}