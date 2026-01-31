'use client'

import { panelType } from '@/Types/UIState';
import styles from './dashboardMenuButton.module.css'; 
import HoverPanel from '@/Components/HoverPanels/hoverPanel';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import Image from 'next/image';
import CloseButton from '@/Components/Buttons/closeButton';

export default function DashboardMenuButton({
    activePanel, 
    setActivePanel,
}: {
    activePanel: panelType; 
    setActivePanel: (panel: panelType) => void; 
}) {
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
                <div className={styles.options} onClick={(e) => { e.stopPropagation(); }}>
                    <div className={styles.closeButton}>
                        <CloseButton onClick={() => setActivePanel('none')} />
                    </div>
                    <header>Menu</header>
                    <ul>
                        <li>
                            <Image src={'./plusSign.svg'} alt='plus sign icon' width={20}  height={20}/>
                            <button>New Board</button>
                        </li>
                        <li>
                            <Image src={'./switchBoard.svg'} alt='plus sign icon' width={20}  height={20}/>
                            <button>Switch board</button>
                        </li>
                        <li>
                            <button>Profile</button>
                        </li>
                        <li>
                            <button>Logout</button>
                        </li>
                    </ul>
                </div>
                : null
            }
        </div>
    ); 
}