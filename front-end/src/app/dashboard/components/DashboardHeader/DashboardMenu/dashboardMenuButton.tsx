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
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" 
                        stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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