'use client'

import { panelType } from '@/app/dashboard/Types/UIState';
import styles from './dashboardMenuButton.module.css'; 
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import Image from 'next/image';
import CloseButton from '@/Components/Buttons/closeButton';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import NewBoardOptions from '../NewBoard/newBoardOptions';
import SwitchBoardOptions from '../SwitchBoard/switchBoardOptions';
import DashboardMenuOptions from './dashboardMenuOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';

export default function DashboardMenuButton() {
    const isDashboardMenuOptionsOpen = useBoardUIStore((state) => state.activePanel === 'dashboardMenuButtonOptions'); 
    const isNewBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'newBoardOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    
    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.menuButton}
                onClick={(e) => {
                    e.stopPropagation(); 
                    setActivePanel(isDashboardMenuOptionsOpen ? 'none' : 'dashboardMenuButtonOptions'); 
                }}>
                <Image src={'./menu-icon.svg'} alt='Menu icon' width={40} height={40} />
            </div>
            {
                isDashboardMenuOptionsOpen ? 
                <DashboardMenuOptions />
                : null
            }
            {
                isNewBoardOptionsOpen ? 
                <NewBoardOptions /> 
                : null
            }
        </div>
    ); 
}