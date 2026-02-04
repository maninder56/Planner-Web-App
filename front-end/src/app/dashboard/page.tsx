'use client'

import { panelType, profileColour } from '@/Types/UIState';
import { useState } from 'react';
import SearchBar from './components/Search/SearchBar/searchBar';
import DashboardMenuButton from './components/DashboardOptions/DashboardMenu/dashboardMenuButton';

import styles from './page.module.css'; 
import AppLogo from './components/AppLogo/appLogo';
import SearchButton from './components/Search/SearchButton/searchButton';
import { ActivePanelContext } from './Hooks/ActivePanel/ActivePanelContext';
import NewBoardButton from './components/DashboardOptions/NewBoard/newBoardButton';
import SwitchBoardButton from './components/DashboardOptions/SwitchBoard/switchBoardButton';
import ProfileButton from './components/DashboardOptions/Profile/ProfileButton/profileButton';

export default function Dashboard() {
    const [activePanel, setActivePanel] = useState<panelType>('none'); 
    
    const tempUser: { name: string, email: string, colour: profileColour} = {
        name: 'Julius Caesar', email: 'caesa23r@gmail.com', colour: 'red'
    }

    return (
        <ActivePanelContext.Provider value={[activePanel, setActivePanel]}>
            <div className={styles.page}
                onClick={(e) => {
                    e.stopPropagation(); 
                    setActivePanel('none'); 
                }}>
                    {/* log search and profile options */}
                    <section className={styles.firstSection}>
                        <div className={styles.appLogo}>
                            <AppLogo />
                        </div>
                        <div className={styles.searchWrapper}>
                            <div className={styles.searchButton}>
                                <SearchButton />
                            </div>
                            <div className={styles.searchBar}>
                                <SearchBar />
                            </div>
                        </div>
                        <div className={styles.dashboardMenuWrapper}>
                            <div className={styles.dashboardMenu}>
                                <DashboardMenuButton />
                            </div>
                            <div className={styles.dashboardOptions}>
                                <NewBoardButton />
                                <SwitchBoardButton />
                                <ProfileButton userName={tempUser.name} userEmail={tempUser.email} iconColour={tempUser.colour} />
                            </div>
                        </div>
                    </section>
                    <main>

                    </main>
            </div>
        </ActivePanelContext.Provider>
    ); 
}