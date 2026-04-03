
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './profileButton.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';

import ProfileOptions from '../ProfileOptions/ProfileOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useUserStore } from '@/Store/userStore';
import ProfileButtonLoadingSkeleton from './ProfileButtonLoadingSkeleton/profileButtonLoadingSkeleton';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UserProfileDataRequest } from '@/Services/userService';
import { useEffect, useState } from 'react';


export default function ProfileButton() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isSwitchBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'profileOptions'); 
     
    const profileColour = useUserStore((state) => state.profileIconColour); 
    const userData = useUserStore((state) => state.userData); 
    const setUserData = useUserStore((state) => state.setUserData); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [loading, setLoading] = useState(true); 

    async function fetchUserData() {
        setLoading(true); 

        try {
            const result = await ApiRequestWithRefreshTokenAttempt(UserProfileDataRequest); 
            if (result.ok && result.data !== undefined) {
                setUserData(result.data);  
            } else if (!result.ok && result.error === 'Unauthorized') {
                setSessionExpired(true);
                setUserData(undefined); 
            } else {
                setUserData(undefined); 
            }
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        if (!userData) {
            fetchUserData();
        }

        setLoading(false); 
    }, []); 


    if (loading) {
        return (
            <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
                <div className={styles.mainButton}>
                    <ProfileButtonLoadingSkeleton />
                </div>
            </div>
        ); 
    }

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <button className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isSwitchBoardOptionsOpen ? 'none' : 'profileOptions'); 
                }}>
                    {
                        userData !== undefined ? 
                            <ProfileIcon userName={userData.name} colour={profileColour} /> 
                        : null
                    }
            </button>
            { isSwitchBoardOptionsOpen && <ProfileOptions userData={userData} iconColour={profileColour} /> }
        </div>
    ); 
}