'use client'

import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import styles from './dashboardMenuOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import Image from 'next/image';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { permanentRedirect, redirect } from 'next/navigation';
import { AppRoute } from '@/Types/appRoutes';
import { useState } from 'react';
import { ApiRequestWithRefreshTokenAttempt } from '@/Services/ApiRequest';
import { LogoutUserRequest } from '@/Services/userService';

export default function DashboardMenuOptions() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const [error, setError] = useState(''); 
    
    const profileRoute: AppRoute = '/profile'; 
    const homeRoute: AppRoute = '/'; 

    async function handleLogout() {
        setButtonDisabled(true); 

        try {
            const result = await ApiRequestWithRefreshTokenAttempt(LogoutUserRequest); 
            if (result.ok) {
                permanentRedirect(homeRoute); 
            } else {
                setError('Log out failed, please try again.'); 
            }

        } finally {
            setButtonDisabled(false); 
        }
    }

    return (
        <HoverOptionsPanel title='Menu' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.optionsList}>
                <div className={styles.error}>{error}</div>
                <button 
                    disabled={isBoardLoading || buttonDisabled}
                    onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel('newBoardOptions'); 
                }}>
                    <Image src={'./plusSign.svg'} alt='plus sign icon' width={20}  height={20}/>
                    <span>New Board</span>
                </button>
                <button 
                    disabled={buttonDisabled}
                    onClick={e => {
                        e.stopPropagation(); 
                        setActivePanel('switchBoardOptions'); 
                }}>
                    <Image src={'./switchBoard.svg'} alt='switch board icon' width={20}  height={20}/>
                    <span>Switch board</span>
                </button>
                <button 
                    disabled={buttonDisabled}
                    onClick={(e) => {
                        e.stopPropagation(); 
                        permanentRedirect(profileRoute);
                }}>
                    <Image src={'./profile-icon.svg'} alt='profile icon' width={20}  height={20}/>
                    <span>Profile</span>
                </button>
                <hr />
                <button disabled={buttonDisabled} className={styles.logoutButton} onClick={handleLogout}>
                    <Image src={'./logout-icon.svg'} alt='logout icon' width={20}  height={20}/>
                    <span>Logout</span>
                </button>
            </div>
        </HoverOptionsPanel>
    ); 
}