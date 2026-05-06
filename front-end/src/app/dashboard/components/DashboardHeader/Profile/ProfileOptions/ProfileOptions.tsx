'use client'


import styles from './ProfileOptions.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';
import ProfileInfo from '../ProfileInfo/profileInfo';
import CloseButton from '@/Components/Buttons/closeButton';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import Image from 'next/image';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { UserProfile } from '@/Types/userTypes';
import { profileColour } from '@/Utilities/user';
import { permanentRedirect, redirect, useRouter } from 'next/navigation';
import { AppRoute } from '@/Types/appRoutes';
import { useState } from 'react';
import { ApiRequestWithRefreshTokenAttempt } from '@/Services/ApiRequest';
import { LogoutUserRequest } from '@/Services/userService';
import { useUserStore } from '@/Store/userStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function ProfileOptions({
    userData,
    iconColour,
}: {
    userData?: UserProfile;   
    iconColour: profileColour; 
}) {
    const resetBoardData = useBoardStore((state) => state.resetBoardData); 
    const resetUserData = useUserStore((state) => state.resetUserData); 

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    
    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const [error, setError] = useState(''); 

    const router = useRouter(); 
    
    const profileRoute: AppRoute = '/profile'; 
    const homeRoute: AppRoute = '/'; 

    async function handleLogout() {
        setButtonDisabled(true); 

        try {
            const result = await ApiRequestWithRefreshTokenAttempt(LogoutUserRequest); 
            if (result.ok) {
                resetBoardData(); 
                resetUserData(); 
                setActivePanel('none');
                permanentRedirect(homeRoute);
            } else {
                setError('Log out failed, please try again.'); 
            }

        } finally {
            setButtonDisabled(false); 
        }
    }

    return (
        <HoverOptionsPanel title='Account' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.optionsList}>
                <div className={styles.error}>{error}</div>
                <div>
                    {userData && <ProfileInfo userProfile={userData} iconColour={iconColour} />}
                </div>
                <button disabled={buttonDisabled}
                    onClick={() => {
                        router.push(profileRoute); 
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.563 18H3.438c-.706 0-1.228-.697-.961-1.338C3.713 13.698 6.617 12 10 12s6.288 1.698 7.524 4.662c.267.641-.255 1.338-.961 1.338M5.917 6c0-2.206 1.832-4 4.083-4s4.083 1.794 4.083 4-1.831 4-4.083 4c-2.251 0-4.083-1.794-4.083-4m14.039 11.636c-.742-3.359-3.064-5.838-6.119-6.963 1.619-1.277 2.563-3.342 2.216-5.603-.402-2.623-2.63-4.722-5.318-5.028C7.023-.381 3.875 2.449 3.875 6c0 1.89.894 3.574 2.289 4.673-3.057 1.125-5.377 3.604-6.12 6.963C-.226 18.857.779 20 2.054 20h15.892c1.276 0 2.28-1.143 2.01-2.364" 
                            fillRule="evenodd"/>
                    </svg>
                    <span>Profile</span>
                </button>
                <hr />
                <button disabled={buttonDisabled} onClick={handleLogout}>
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" fill="none">
                        <g fill="#000000">
                            <path d="M93.408 7.813c-8.546 0-15.437 0-20.856.729-5.624.754-10.362 2.374-14.123 6.134-3.28 3.28-4.94 7.315-5.81 12.052-.844 4.601-1.006 10.235-1.044 16.995a4.688 4.688 0 0 0 9.375.054c.038-6.836.215-11.678.89-15.356.65-3.543 1.696-5.594 3.217-7.113 1.73-1.73 4.16-2.86 8.745-3.476 4.721-.635 10.977-.645 19.95-.645h6.25c8.97 0 15.228.01 19.949.645 4.585.616 7.014 1.745 8.745 3.476 1.729 1.727 2.856 4.156 3.474 8.743.633 4.72.644 10.977.644 19.949v50c0 8.972-.01 15.229-.644 19.95-.618 4.586-1.745 7.012-3.474 8.742s-4.16 2.86-8.745 3.476c-4.721.635-10.979.644-19.95.644h-6.25c-8.972 0-15.228-.009-19.949-.644-4.585-.616-7.014-1.745-8.745-3.476-1.52-1.52-2.566-3.57-3.216-7.113-.676-3.678-.853-8.52-.891-15.356a4.688 4.688 0 0 0-9.375.055c.038 6.76.2 12.393 1.045 16.994.87 4.737 2.528 8.769 5.809 12.052 3.761 3.76 8.5 5.38 14.123 6.134 5.419.73 12.31.73 20.856.73h6.937c8.546 0 15.436 0 20.856-.73 5.624-.754 10.36-2.374 14.123-6.134 3.763-3.762 5.38-8.499 6.137-14.127.728-5.416.728-12.307.728-20.855V49.658c0-8.548 0-15.439-.728-20.855-.757-5.628-2.374-10.365-6.137-14.127-3.763-3.76-8.499-5.38-14.123-6.134-5.42-.73-12.31-.73-20.856-.73z"/>
                            <path d="M93.75 70.313a4.688 4.688 0 0 1 0 9.374H25.17l12.255 10.504a4.687 4.687 0 1 1-6.1 7.118L9.45 78.559A4.69 4.69 0 0 1 7.813 75a4.69 4.69 0 0 1 1.637-3.559l21.875-18.75a4.687 4.687 0 1 1 6.1 7.118L25.171 70.313z" />
                        </g>
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </HoverOptionsPanel>
    ); 
}