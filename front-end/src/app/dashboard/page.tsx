'use client'

import IconButton from '@/Components/Buttons/iconButton';
import { panelType } from '@/Types/UIState';
import { act, useState } from 'react';
import SearchBar from './components/Search/searchBar';
import ProfileIcon from './components/ProfileIcon/profileIcon';
import ProfileInfo from './components/ProfileInfo/profileInfo';
import ProfileOptions from './components/ProfileOptions/ProfileOptions';
import CloseButton from '@/Components/Buttons/closeButton';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import HoverPanel from '@/Components/HoverPanels/hoverPanel';
import DashboardMenu from './components/DashboardMenu/dashboardMenu';

import styles from './page.module.css'; 
import AppLogo from './components/AppLogo/appLogo';
import SearchButton from './components/Search/SearchButton/searchButton';

export default function Dashboard() {

    const [activePanel, setActivePanel] = useState<panelType>('none'); 

    return (
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
                            <SearchButton activePanel={activePanel} setActivePanel={setActivePanel} />
                        </div>
                        <div className={styles.searchBar}>
                            <SearchBar activePanel={activePanel} setActivePanel={setActivePanel} />
                        </div>
                    </div>
                    <div>
                        <DashboardMenu activePanel={activePanel} setActivePanel={setActivePanel} />
                    </div>
                </section>
                <main>

                </main>
        </div>
    ); 
}