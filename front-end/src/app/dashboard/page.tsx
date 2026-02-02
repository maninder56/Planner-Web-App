'use client'

import IconButton from '@/Components/Buttons/iconButton';
import { panelType } from '@/Types/UIState';
import { act, createContext, useContext, useState } from 'react';
import SearchBar from './components/Search/SearchBar/searchBar';
import ProfileIcon from './components/ProfileIcon/profileIcon';
import ProfileInfo from './components/ProfileInfo/profileInfo';
import ProfileOptions from './components/ProfileOptions/ProfileOptions';
import CloseButton from '@/Components/Buttons/closeButton';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import HoverPanel from '@/Components/HoverPanels/hoverPanel';
import DashboardMenuButton from './components/DashboardOptions/DashboardMenuButton/dashboardMenuButton';

import styles from './page.module.css'; 
import AppLogo from './components/AppLogo/appLogo';
import SearchButton from './components/Search/SearchButton/searchButton';
import { ActivePanelContext } from './Hooks/ActivePanel/ActivePanelContext';
import NewBoardButton from './components/DashboardOptions/NewBoard/newBoardButton';

export default function Dashboard() {
    const [activePanel, setActivePanel] = useState<panelType>('none'); 

    return (
        <ActivePanelContext.Provider value={[activePanel, setActivePanel]}>
            <div className={styles.page}
                onClick={(e) => {
                    e.stopPropagation(); 
                    setActivePanel('none'); 
                }}>
                    {/* log search and profile options */}
                    <section className={styles.firstSection}>
                        <div>
                            <AppLogo />
                        </div>
                        <div>
                            <div className={styles.searchButton}>
                                <SearchButton />
                            </div>
                            <div className={styles.searchBar}>
                                <SearchBar />
                            </div>
                        </div>
                        <div>
                            <div className={styles.dashboardMenu}>
                                <DashboardMenuButton />
                            </div>
                            <div className={styles.dashboardOptions}>
                                <NewBoardButton />
                            </div>
                        </div>
                    </section>
                    <main>

                    </main>
            </div>
        </ActivePanelContext.Provider>
    ); 
}