
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './manageBoardMembersOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useEffect, useState } from 'react';
import { BoardMemberData, UpdateUserRolesData, UserRole } from '@/app/dashboard/Types/boardTypes';
import Button from '@/Components/Buttons/button';
import InboxOptionsLoadingSkeleton from '../../../DashboardHeader/Inbox/InboxOptions/InboxOptionsLoadingSkeleton/inboxOptionsLoadingSkeleton';
import ManageBoardMembersOptionsSkeleton from './manageBoardMembersOptionsSkeleton';
import RemoveMemberFromBoardConfirmation from './RemoveMemberFromBoardConfirmation/removeMemberFromBoardConfirmation';
import { useUserStore } from '@/Store/userStore';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { GetBoardMembersRequest, UpdateBoardMembershipRequest } from '@/app/dashboard/Services/boardService';


export default function ManageBoardMembersOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const boardMembers = useBoardStore((state) => state.boardMembers); 
    const setBoardMembers = useBoardStore((state) => state.SetBoardMembers); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const currentBoardId = useBoardStore((state) => state.currentBoardData?.id); 

    const [loading, setLoading] = useState(false); 
    const availalbeRoles: UserRole[] = ['Member', 'Viewer']; 

    const owner = boardMembers?.filter(u => u.role === 'Owner'); 
    const [members, setMembers] = useState(boardMembers?.filter(u => u.role === 'Member')); 
    const [viewers, setViewers] = useState(boardMembers?.filter(u => u.role === 'Viewer')); 

    const [error, setError] = useState(''); 

    const [showUpdateButton, setShowUpdateButton] = useState(false); 

    const [userToRemove, setUserToRemove] = useState<BoardMemberData | undefined>(undefined); 
    

    function ResetMembership() {
        if (!boardMembers) {
            return; 
        }

        setMembers(boardMembers?.filter(u => u.role === 'Member')); 
        setViewers(boardMembers?.filter(u => u.role === 'Viewer')); 
    }

    function HasUserMembershipChanged() {
        if (!boardMembers) {
            return false;
        }

        const currentUsers = [...(members ?? []), ...(viewers ?? [])];

        return currentUsers.some(currentUser => {
            const originalUser = boardMembers.find(
                u => u.userId === currentUser.userId
            );

            return originalUser?.role !== currentUser.role;
        });
    }

    useEffect(() => {
        setShowUpdateButton(HasUserMembershipChanged()); 
    }, [members, viewers, boardMembers]); 

    function handleMemberRoleChange(role: string, userId: number) {
        if (!(role === 'Member' || role === 'Viewer')) {
            return; 
        }

        if (!members) {
            return; 
        }

        const newMembers: BoardMemberData[] = members.map(user => {
            if (user.userId === userId) {
                return {
                    ...user, 
                    role: role
                }; 
            } else {
                return user; 
            }
        })

        setMembers(newMembers); 
    }

    function handleViewerRoleChange(role: string, userId: number) {
        if (!(role === 'Member' || role === 'Viewer')) {
            return; 
        }

        if (!viewers) {
            return; 
        }

        const newViewers: BoardMemberData[] = viewers.map(user => {
            if (user.userId === userId) {
                return {
                    ...user, 
                    role: role
                }; 
            } else {
                return user; 
            }
        })

        setViewers(newViewers); 
    }

    async function handleSaveButton() {
        if (!currentBoardId || !boardMembers) {
            return; 
        }

        const newMemberRole = [...(members ?? []), ...(viewers ?? [])]
            .filter(user => {
                const originalUser = boardMembers.find(u => u.userId === user.userId); 
                return originalUser?.role !== user.role; 
            })
            .map(user => {
                return {
                    userId: user.userId, 
                    newRole: user.role
                }
            }); 

        const updatedRoles: UpdateUserRolesData = {
            roles: newMemberRole,
        }

        const result = await ApiRequestWithRefreshTokenAttemptAndData(UpdateBoardMembershipRequest, {
            boardId: currentBoardId, updatedRoles: updatedRoles
        }); 

        if (result.ok) {
            setError(''); 
            const newBoardMembers = boardMembers.map(user => {
                const newUser = newMemberRole.find(u => u.userId === user.userId); 
                if (newUser) {
                    return {
                        ...user, 
                        role: newUser.newRole, 
                    }
                } else {
                    return user
                }
            }); 

            setBoardMembers(newBoardMembers); 
            setMembers(newBoardMembers.filter(u => u.role === 'Member')); 
            setViewers(newBoardMembers.filter(u => u.role === 'Viewer')); 
        } else if (result.error === 'Unauthorized') {
            setSessionExpired(true); 
        } else {
            setError('Failed to update roles, please try again'); 
        }
    }


    async function fetchMemberData() { 
        setBoardMembers(undefined); 

        if (!currentBoardId) {
            return; 
        }

        setLoading(true);

        try {
            const result = await ApiRequestWithRefreshTokenAttemptAndData(GetBoardMembersRequest, currentBoardId); 
            if (result.ok) {
                if (result.data !== undefined) {
                    setBoardMembers(result.data); 
                    setMembers(result.data?.filter(u => u.role === 'Member')); 
                    setViewers(result.data?.filter(u => u.role === 'Viewer')); 
                }
            } else if (result.error === 'Unauthorized') {
                setSessionExpired(true); 
            }
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        fetchMemberData(); 
    }, [])
    
    if (loading) {
        return (
            <BigHoverPanel title='Manage Board Members' onCloseClick={() => setActivePanel('none')}>
                <div className={styles.wrapper}>
                    <ManageBoardMembersOptionsSkeleton />
                </div>
            </BigHoverPanel>
        ); 
    }

    if (!boardMembers) {
        return (
            <BigHoverPanel title='Manage Board Members' onCloseClick={() => setActivePanel('none')}>
                <div className={styles.wrapper}>
                    <div className={styles.failedToGetData}>
                        <p>Failed to get board members.</p>
                        <Button name='Try again' color='red' onClick={fetchMemberData} />
                    </div>
                </div>
            </BigHoverPanel>
        ); 
    }

    return (
        <BigHoverPanel title='Manage Board Members' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
            <div className={styles.error}>{error}</div>
                {
                    owner &&
                    <div className={styles.memberCategoryContainer}>
                        <header className={styles.categoryHeader}>Owner</header>
                        <ul>
                            {
                                owner.map(u => 
                                    <li key={u.userId} className={styles.grid}>
                                        <div className={styles.userInfo}>
                                            <header>{u.name}</header>
                                            <span>{u.email}</span>
                                        </div>
                                        <div className={styles.userRole}>
                                            <span>{u.role}</span>
                                        </div>
                                        <div className={styles.removeButton}>

                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                }
                {
                    members && members.length > 0 &&
                    <div className={styles.memberCategoryContainer}>
                        <header className={styles.categoryHeader}>Members</header>
                        <ul>
                            {
                                members.map(u => 
                                    <li key={u.userId} className={styles.grid}>
                                        <div className={styles.userInfo}>
                                            <header>{u.name}</header>
                                            <span>{u.email}</span>
                                        </div>
                                        <div className={styles.userRole}>
                                            <select name='role' value={u.role} onChange={e => handleMemberRoleChange(e.target.value, u.userId)}>
                                                {availalbeRoles.map(role => <option key={role} value={role}>{role}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.removeButton}>
                                            <Button name={'Remove'} color={'red'} onClick={() => setUserToRemove(u)} />
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                }
                {
                    viewers && viewers.length > 0 &&
                    <div className={styles.memberCategoryContainer}>
                        <header className={styles.categoryHeader}>Viewers</header>
                        <ul>
                            {
                                viewers.map(u => 
                                    <li key={u.userId} className={styles.grid}>
                                        <div className={styles.userInfo}>
                                            <header>{u.name}</header>
                                            <span>{u.email}</span>
                                        </div>
                                        <div className={styles.userRole}>
                                            <select name='role' value={u.role} onChange={e => handleViewerRoleChange(e.target.value, u.userId)}>
                                                {availalbeRoles.map(role => <option key={role} value={role}>{role}</option>)}
                                            </select>
                                        </div>
                                        <div className={styles.removeButton}>
                                            <Button name={'Remove'} color={'red'} onClick={() => setUserToRemove(u)} />
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                }
                {
                    showUpdateButton &&
                    <div className={styles.saveButton}>
                        <Button name='Cancel' color='transparent-with-outline' onClick={ResetMembership} />
                        <Button name='Save' color='blue' onClick={handleSaveButton} />
                    </div>
                }
                {
                    userToRemove && <RemoveMemberFromBoardConfirmation memberData={userToRemove} onCancel={() => setUserToRemove(undefined)} />
                }
            </div>
        </BigHoverPanel>
    ); 
}