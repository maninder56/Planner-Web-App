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
import { useInvitationStore } from '../../Store/invitationStore';

export default function DashboardHeader() {
    const isSwitchBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'switchBoardOptions'); 
    const isInboxOptionsOpen = useBoardUIStore((state) => state.activePanel === 'inboxOptionsPanel'); 

    // Temporary data 
    const setInvitations = useInvitationStore((state) => state.setInvitations); 

    setInvitations([
    {
        "id": 8,
        "boardName": "Very big board name of the centruey oasdfjafsname of the centruey oasdfjafsname of the centruey oasdfjafsname of the centruey oasdfjafsname of the centruey oasdfjafs",
        "invitedByUserEmail": "usernenone@gmail.com",
        "role": "Member",
        "status": "Pending",
        "expiresAt": "2026-05-18T15:54:22.399039"
    },
    {
        "id": 9,
        "boardName": "Alpha",
        "invitedByUserEmail": "usernentwo@gmail.com",
        "role": "Viewer",
        "status": "Accepted",
        "expiresAt": "2026-05-20T10:15:12.123456"
    },
    {
        "id": 10,
        "boardName": "Beta",
        "invitedByUserEmail": "userthree@gmail.com",
        "role": "Member",
        "status": "Rejected",
        "expiresAt": "2026-05-21T08:45:00.654321"
    },
    {
        "id": 11,
        "boardName": "Gamma",
        "invitedByUserEmail": "userfour@gmail.com",
        "role": "Viewer",
        "status": "Pending",
        "expiresAt": "2026-05-22T14:30:45.789012"
    },
    {
        "id": 12,
        "boardName": "Delta",
        "invitedByUserEmail": "userfive@gmail.com",
        "role": "Member",
        "status": "Accepted",
        "expiresAt": "2026-05-23T09:12:33.456789"
    },
    {
        "id": 13,
        "boardName": "Epsilon",
        "invitedByUserEmail": "userfsix@gmail.com",
        "role": "Viewer",
        "status": "Rejected",
        "expiresAt": "2026-05-24T11:05:22.987654"
    },
    {
        "id": 14,
        "boardName": "Zeta",
        "invitedByUserEmail": "userseven@gmail.com",
        "role": "Member",
        "status": "Pending",
        "expiresAt": "2026-05-25T16:40:10.111222"
    },
    {
        "id": 15,
        "boardName": "Eta",
        "invitedByUserEmail": "usereight@gmail.com",
        "role": "Viewer",
        "status": "Accepted",
        "expiresAt": "2026-05-26T13:25:55.333444"
    },
    {
        "id": 16,
        "boardName": "Theta",
        "invitedByUserEmail": "usernine@gmail.com",
        "role": "Member",
        "status": "Rejected",
        "expiresAt": "2026-05-27T18:55:01.555666"
    },
    {
        "id": 17,
        "boardName": "Iota",
        "invitedByUserEmail": "usernten@gmail.com",
        "role": "Viewer",
        "status": "Pending",
        "expiresAt": "2026-05-28T07:20:18.777888"
    },
    {
        "id": 18,
        "boardName": "Kappa",
        "invitedByUserEmail": "userneleven@gmail.com",
        "role": "Member",
        "status": "Accepted",
        "expiresAt": "2026-05-29T12:00:00.999000"
    },
    {
        "id": 19,
        "boardName": "Lambda",
        "invitedByUserEmail": "usernetweleve@gmail.com",
        "role": "Viewer",
        "status": "Rejected",
        "expiresAt": "2026-05-30T15:45:27.222333"
    },
    {
        "id": 20,
        "boardName": "Mu",
        "invitedByUserEmail": "userneninewn@gmail.com",
        "role": "Member",
        "status": "Pending",
        "expiresAt": "2026-05-31T20:10:40.444555"
    }
    ]); 

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