import AppLogo from './AppLogo/appLogo';
import styles from './dashboardHeader.module.css'; 
import DashboardMenuButton from './DashboardMenu/dashboardMenuButton';
import DashboardSearchBar from './DashboardSearch/DashboardSearchBar/dashboardSearchBar';
import DashboardSearchButton from './DashboardSearch/DashboardSearchButton/dashboardSearchButton';
import NewBoardButton from './NewBoard/newBoardButton';
import ProfileButton from './Profile/ProfileButton/profileButton';
import SwitchBoardButton from './SwitchBoard/switchBoardButton';

export default function DashboardHeader() {
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
                    <ProfileButton userName='temp user' userEmail='tempuser@gmail.com' iconColour='red' />
                </div>
            </div>
        </section>
    ); 
}