'use client'

import { panelType } from '@/Types/UIState';
import styles from './dashboardMenuButton.module.css'; 
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import Image from 'next/image';
import CloseButton from '@/Components/Buttons/closeButton';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import NewBoardOptions from '../NewBoard/newBoardOptions';
import SwitchBoardOptions from '../SwitchBoard/switchBoardOptions';
import DashboardMenuOptions from './dashboardMenuOptions';

export default function DashboardMenuButton() {
    const [activePanel, setActivePanel] = useActivePanel(); 
    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.menuButton}
                onClick={(e) => {
                    e.stopPropagation(); 
                    setActivePanel(activePanel === 'dashboardMenuButtonOptions' ? 'none' : 'dashboardMenuButtonOptions'); 
                }}>
                <Image src={'./menu-icon.svg'} alt='Menu icon' width={40} height={40} />
            </div>
            {
                activePanel === 'dashboardMenuButtonOptions' ? 
                <DashboardMenuOptions />
                : null
            }
            {
                activePanel === 'newBoardOptions' ? 
                <NewBoardOptions /> 
                : null
            }
            {
                activePanel === 'switchBoardOptions' ? 
                <SwitchBoardOptions />
                : null
            }
        </div>
    ); 
}