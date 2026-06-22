
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './manageBoardMembersOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useEffect, useState } from 'react';
import { BoardMemberData, UserRole } from '@/app/dashboard/Types/boardTypes';
import Button from '@/Components/Buttons/button';
import InboxOptionsLoadingSkeleton from '../../../DashboardHeader/Inbox/InboxOptions/InboxOptionsLoadingSkeleton/inboxOptionsLoadingSkeleton';
import ManageBoardMembersOptionsSkeleton from './manageBoardMembersOptionsSkeleton';

export default function ManageBoardMembersOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const boardMembers = useBoardStore((state) => state.boardMembers); 

    const [loading, setLoading] = useState(false); 
    const availalbeRoles: UserRole[] = ['Member', 'Viewer']; 

    const owner = boardMembers?.filter(u => u.role === 'Owner'); 
    const [members, setMembers] = useState(boardMembers?.filter(u => u.role === 'Member')); 
    const [viewers, setViewers] = useState(boardMembers?.filter(u => u.role === 'Viewer')); 

    const [showUpdateButton, setShowUpdateButton] = useState(false); 
    

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
                    Failed to get board members, please try again.
                </div>
            </BigHoverPanel>
        ); 
    }

    return (
        <BigHoverPanel title='Manage Board Members' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                {
                    owner &&
                    <div className={styles.memberCategoryContainer}>
                        <header className={styles.categoryHeader}>Owner</header>
                        <ul>
                            {
                                owner.map(u => 
                                    <li className={styles.grid}>
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
                    members && 
                    <div className={styles.memberCategoryContainer}>
                        <header className={styles.categoryHeader}>Members</header>
                        <ul>
                            {
                                members.map(u => 
                                    <li className={styles.grid}>
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
                                            <Button name={'Remove'} color={'red'} onClick={() => {}} />
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                }
                {
                    viewers &&
                    <div className={styles.memberCategoryContainer}>
                        <header className={styles.categoryHeader}>Viewers</header>
                        <ul>
                            {
                                viewers.map(u => 
                                    <li className={styles.grid}>
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
                                            <Button name={'Remove'} color={'red'} onClick={() => {}} />
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
                        <Button name='Cancle' color='transparent-with-outline' onClick={ResetMembership} />
                        <Button name='Save' color='blue' onClick={() => {}} />
                    </div>
                }
            </div>
        </BigHoverPanel>
    ); 
}