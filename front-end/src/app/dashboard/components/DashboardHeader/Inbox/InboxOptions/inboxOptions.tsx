

import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './inboxOptions.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useInvitationStore } from '@/app/dashboard/Store/invitationStore';
import Button from '@/Components/Buttons/button';
import { InvitationStatus } from '@/app/dashboard/Types/invitationTypes';
import InboxOptionsLoadingSkeleton from './InboxOptionsLoadingSkeleton/inboxOptionsLoadingSkeleton';
import { useEffect, useState } from 'react';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { GetAllInvitationsReceivedRequest } from '@/app/dashboard/Services/invitationService';
import { useUserStore } from '@/Store/userStore';

export default function InboxOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    
    const invitations = useInvitationStore((state) => state.invitations); 
    const setInvitations = useInvitationStore((state) => state.setInvitations); 

    const loading = useInvitationStore((state) => state.loadingInvitations); 
    const setLoading = useInvitationStore((state) => state.setLoadingInvitation); 
    
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [failedToLoadData, setFailedToLoadData] = useState(false); 

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

    async function fetchInvitationsData() {
        setLoading(true); 
        setFailedToLoadData(false); 

        try {
            const result = await ApiRequestWithRefreshTokenAttempt(GetAllInvitationsReceivedRequest);

            if (result.ok) {
                if (result.data !== undefined) {
                    setInvitations(result.data); 
                } else {
                    setInvitations(null); 
                    setFailedToLoadData(true); 
                }
            } else if (result.error === 'Unauthorized') {
                setSessionExpired(true); 
                setInvitations(null); 
            } else {
                setInvitations(null); 
                setFailedToLoadData(true); 
            }

        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        if (invitations === null) {
            fetchInvitationsData(); 
        }
    }, []); 



    if (loading) {
        return (
            <BigHoverPanel title='Inbox' onCloseClick={() => setActivePanel('none')}>
                <InboxOptionsLoadingSkeleton />
            </BigHoverPanel>
        ); 
    }

    if (failedToLoadData || invitations === null) {
        return (
            <BigHoverPanel title='Inbox' onCloseClick={() => setActivePanel('none')}>
                <div className={[styles.wrapper, styles.failedToLoad].join(' ')}>
                    <header>Failed to load inbox, Please try again.</header>
                    <Button name='Try again' color='red' onClick={fetchInvitationsData} />
                </div>
            </BigHoverPanel>
        ); 
    }

    if (invitations.length === 0) {
        return (
            <BigHoverPanel title='Inbox' onCloseClick={() => setActivePanel('none')}>
                <div className={styles.wrapper}>
                    <p className={styles.noInvitationMessage}>Your inbox is empty</p>
                </div>
            </BigHoverPanel>
        ); 
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
                                        <Button name='Accept' color='lightGreen' onClick={() => {}} />
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