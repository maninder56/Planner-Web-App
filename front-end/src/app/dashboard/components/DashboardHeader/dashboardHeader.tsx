'use client'

import { useEffect } from 'react';
import { useUserStore } from '../../../../Store/userStore';
import AppLogo from './AppLogo/appLogo';
import styles from './dashboardHeader.module.css'; 
import DashboardMenuButton from './DashboardMenu/dashboardMenuButton';
import DashboardSearchBar from './DashboardSearch/DashboardSearchBar/dashboardSearchBar';
import DashboardSearchButton from './DashboardSearch/DashboardSearchButton/dashboardSearchButton';
import NewBoardButton from './NewBoard/newBoardButton';
import ProfileButton from './Profile/ProfileButton/profileButton';
import SwitchBoardButton from './SwitchBoard/switchBoardButton';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UserProfileDataRequest } from '@/Services/userService';
import { useBoardUIStore } from '../../Store/boardUIStore';
import SwitchBoardOptions from './SwitchBoard/switchBoardOptions';
import InboxOptions from './Inbox/InboxOptions/inboxOptions';
import InboxButton from './Inbox/inboxButton';

export default function DashboardHeader() {
    const isSwitchBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'switchBoardOptions'); 
    const isInboxOptionsOpen = useBoardUIStore((state) => state.activePanel === 'inboxOptionsPanel'); 

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
                    <InboxButton />
                    <ProfileButton />
                </div>
            </div>
            { isSwitchBoardOptionsOpen && <SwitchBoardOptions/> }
            { isInboxOptionsOpen && <InboxOptions /> }
        </section>
    ); 
}