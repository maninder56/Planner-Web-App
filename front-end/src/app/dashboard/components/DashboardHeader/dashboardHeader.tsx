'use client'

import { useEffect } from 'react';
import { useUserStore } from '../../Store/userStore';
import AppLogo from './AppLogo/appLogo';
import styles from './dashboardHeader.module.css'; 
import DashboardMenuButton from './DashboardMenu/dashboardMenuButton';
import DashboardSearchBar from './DashboardSearch/DashboardSearchBar/dashboardSearchBar';
import DashboardSearchButton from './DashboardSearch/DashboardSearchButton/dashboardSearchButton';
import NewBoardButton from './NewBoard/newBoardButton';
import ProfileButton from './Profile/ProfileButton/profileButton';
import SwitchBoardButton from './SwitchBoard/switchBoardButton';
import { ApiRequestWithRefreshTokenAttempt } from '@/Services/ApiRequest';
import { UserProfileDataRequest } from '@/Services/userService';

export default function DashboardHeader() {
    const setUserProfile = useUserStore((state) => state.setUserData); 
    const setUserProfileLoading = useUserStore((state) => state.setUserDataLoading); 

    useEffect(() => {
        async function fetchUserData() {
            const result = await ApiRequestWithRefreshTokenAttempt(UserProfileDataRequest); 
            if (result.ok && result.data !== undefined) {
                setUserProfile(result.data);  
            }  
            setUserProfileLoading(false); 
        }
        fetchUserData();
    }, [])


    return (
        <section className={styles.wrapper}>
            <div className={styles.appLogo}>
                <AppLogo />
            </div>
            <div className={styles.searchWrapper}>
                <div className={styles.searchButton}>
                    <DashboardSearchButton />
                </div>
                <div className={styles.searchBar}>
                    <DashboardSearchBar />
                </div>
            </div>
            <div className={styles.dashboardMenuWrapper}>
                <div className={styles.dashboardMenu}>
                    <DashboardMenuButton />
                </div>
                <div className={styles.dashboardOptions}>
                    <NewBoardButton />
                    <SwitchBoardButton />
                    <ProfileButton />
                </div>
            </div>
        </section>
    ); 
}