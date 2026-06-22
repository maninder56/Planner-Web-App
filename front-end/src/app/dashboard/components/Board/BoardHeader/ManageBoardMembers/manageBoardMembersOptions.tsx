
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './manageBoardMembersOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useState } from 'react';
import { UserRole } from '@/app/dashboard/Types/boardTypes';
import Button from '@/Components/Buttons/button';

export default function ManageBoardMembersOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const boardMembers = useBoardStore((state) => state.boardMembers); 

    const [loading, setLoading] = useState(false); 
    const availalbeRoles: UserRole[] = ['Member', 'Viewer']; 

    const owner = boardMembers?.filter(u => u.role === 'Owner'); 
    const [members, setMembers] = useState(boardMembers?.filter(u => u.role === 'Member')); 
    const [viewers, setViewers] = useState(boardMembers?.filter(u => u.role === 'Viewer')); 
    

    function handleMemberRoleChange(role: string) {

    }

    function handleViewerRoleChange(role: string) {

    }
    
    if (loading) {
        return (
            <BigHoverPanel title='Manage Board Members' onCloseClick={() => setActivePanel('none')}>
                <div className={styles.wrapper}>
                    loading
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
                                            <select name='role' value={u.role} onChange={e => handleMemberRoleChange(e.target.value)}>
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
                                            <select name='role' value={u.role} onChange={e => handleViewerRoleChange(e.target.value)}>
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
            </div>
        </BigHoverPanel>
    ); 
}