

import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './inboxOptions.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useInvitationStore } from '@/app/dashboard/Store/invitationStore';
import Button from '@/Components/Buttons/button';
import { InvitationStatus } from '@/app/dashboard/Types/invitationTypes';
import InboxOptionsLoadingSkeleton from './InboxOptionsLoadingSkeleton/inboxOptionsLoadingSkeleton';
import { useEffect, useState } from 'react';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { GetAllInvitationsReceivedRequest, RespondToInvitationRequest } from '@/app/dashboard/Services/invitationService';
import { useUserStore } from '@/Store/userStore';
import { GetBoardRequest, UpdateLastUsedBoardRequest } from '@/app/dashboard/Services/boardService';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { NormaliseBoardData } from '@/app/dashboard/Utilities/boardData';

export default function InboxOptions() {
    const invitations = useInvitationStore((state) => state.invitations); 
    const loading = useInvitationStore((state) => state.loadingInvitations); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setInvitations = useInvitationStore((state) => state.setInvitations); 
    const setLoading = useInvitationStore((state) => state.setLoadingInvitation); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const setInvitationStatus = useInvitationStore((state) => state.setInvitationStatus); 
    const invitationStale = useInvitationStore((state) => state.stale); 
    const setInvitationsStale = useInvitationStore((state) => state.setStale); 

    const setLastUsedBoardExists = useBoardStore((state) => state.setLastUsedBoardExists); 
    const setBoardLoading = useBoardStore((state) => state.setBoardLoading); 
    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const currentBoardData = useBoardStore((state) => state.currentBoardData); 
    const resetBoardArray = useBoardStore((state) => state.resetBoardArray); 

    const [failedToLoadData, setFailedToLoadData] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [buttonsDisabled, setButtonsDisabled] = useState(false); 

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


    async function acceptInvitationRequest(invitationId: number) {
        setButtonsDisabled(true); 

        try {
            const result = await ApiRequestWithRefreshTokenAttemptAndData(RespondToInvitationRequest, {
                invitationId: invitationId, status: 'Accepted', 
            }); 

            if (result.ok) {
                setInvitationStatus(invitationId, 'Accepted'); 
                switchBoard(invitationId); 
                resetBoardArray(); 
            } else if (result.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else if (result.error === 'BadRequest') {
                setErrorMessage('The invitation is no longer valid.');
                setInvitationStatus(invitationId, 'Invalidated');
            } else if (result.error === 'NotFound') {
                setErrorMessage('The board you were invited in does not exists anymore.'); 
                setInvitationStatus(invitationId, 'Invalidated'); 
            } else {
                setErrorMessage('An Error occured, please try again.'); 
            }
        } finally {
            setButtonsDisabled(false); 
        }
    }

    function getBoardIdFromInvitation(invitationId: number) {
        return invitations?.find(i => i.id === invitationId)?.boardId; 
    }

    async function switchBoard(invitationId: number) {
        const boardId = getBoardIdFromInvitation(invitationId); 

        if (boardId === undefined) {
            setErrorMessage('Failed to switch board. Please try again from the switch board panel.'); 
            return; 
        } else if (currentBoardData !== undefined  && currentBoardData.id === boardId) {
            setActivePanel('none');     
            return; 
        }

        setBoardLoading(true); 
        
        try {
            const result = await ApiRequestWithRefreshTokenAttemptAndData(GetBoardRequest, boardId); 

            if (result.ok && result.data !== undefined) {
                hydrateBoard(NormaliseBoardData(result.data)); 
                setLastUsedBoard(boardId); 
                setActivePanel('none');     
            } else if (!result.ok && result.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else {
                setErrorMessage('Failed to switch board. Please try again from the switch board panel.'); 
            }

        } finally {
            setBoardLoading(false); 
        }
    }


    async function setLastUsedBoard(boardId: number) {
        const lastUsedBoardResult =  await ApiRequestWithRefreshTokenAttemptAndData(
            UpdateLastUsedBoardRequest, boardId); 

        if (lastUsedBoardResult.ok) {
            setLastUsedBoardExists(true); 
        } else if (!lastUsedBoardResult.ok && lastUsedBoardResult.error === 'Unauthorized') {
            setSessionExpired(true); 
        }
    }

    async function rejectInvitationRequest(invitationId: number) {
        setButtonsDisabled(true); 

        try {
            const result = await ApiRequestWithRefreshTokenAttemptAndData(RespondToInvitationRequest, {
                invitationId: invitationId, status: 'Rejected', 
            }); 

            if (result.ok) {
                setInvitationStatus(invitationId, 'Rejected'); 
            } else if (result.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else if (result.error === 'BadRequest') {
                setErrorMessage('The invitation is no longer valid.');
                setInvitationStatus(invitationId, 'Invalidated');
            } else {
                setErrorMessage('An Error occured, please try again.'); 
            }   
        } finally {
            setButtonsDisabled(false); 
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

    async function fetchInvitationsDataInBackground() {
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
    }

    useEffect(() => {
        if (invitations === null) {
            fetchInvitationsData(); 
        } else if (invitationStale) {
            fetchInvitationsDataInBackground(); 
            setInvitationsStale(false); 
        }
    }, [invitationStale]); 



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
            <>
            <div className={styles.errorMessage}>{errorMessage}</div>
            <ul className={styles.wrapper}>
                {
                    invitations.map(invite => 
                        <li key={invite.id}>
                            <div className={styles.inviteInfo}>
                                <div className={styles.boardName}>{invite.boardName}</div>
                                <div className={styles.invitedBy}>Invited By: {invite.invitedByUserEmail}</div>
                                <div  className={styles.meta}>
                                    <div className={styles.metaItem}>Status: {invite.status}</div>
                                    <div className={styles.metaItem}>Role: {invite.role}</div>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                {
                                    invite.status !== 'Pending' ? null : 
                                    <div className={styles.buttons}>
                                        <Button name='Accept' color='lightGreen' disabled={buttonsDisabled} 
                                            onClick={() => acceptInvitationRequest(invite.id)} />
                                        <Button name='Reject' color='red' disabled={buttonsDisabled} 
                                            onClick={() => rejectInvitationRequest(invite.id)} />
                                    </div>
                                }
                                <div className={styles.expireText}>Expires at: {formatInviteDate(invite.expiresAt)}</div>
                            </div>
                        </li>
                    )
                }
            </ul>
            </>
        </BigHoverPanel>
    ); 
}