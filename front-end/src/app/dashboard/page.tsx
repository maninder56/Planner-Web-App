'use client'

import IconButton from '@/Components/Buttons/iconButton';
import { panelType } from '@/Types/UIState';
import { useState } from 'react';
import SearchBar from './components/Search/searchBar';
import ProfileIcon from './components/ProfileIcon/profileIcon';
import ProfileInfo from './components/ProfileInfo/profileInfo';
import ProfileOptions from './components/ProfileOptions/ProfileOptions';
import ClosePanelButton from '@/Components/Buttons/closePanelButton';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import HoverPanel from '@/Components/HoverPanels/hoverPanel';
import DashboardMenu from './components/DashboardMenu/dashboardMenu';

import styles from './page.module.css'; 
import AppLogo from './components/AppLogo/appLogo';

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
                    <div>Search button</div>
                    <div>Menu button</div>
                </section>
                <main>

                </main>
        </div>
    ); 
}