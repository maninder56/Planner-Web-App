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
                    <div className={styles.menuAndCloseButton}>
                        <header>Menu</header>
                        <div className={styles.closeButton}>
                            <CloseButton onClick={() => setActivePanel('none')} />
                        </div>
                    </div>
                    <div className={styles.optionsList}>
                        <button>
                            <Image src={'./plusSign.svg'} alt='plus sign icon' width={20}  height={20}/>
                            <span>New Board</span>
                        </button>
                        <button>
                            <Image src={'./switchBoard.svg'} alt='switch board icon' width={20}  height={20}/>
                            <span>Switch board</span>
                        </button>
                        <button>
                            <Image src={'./profile-icon.svg'} alt='profile icon' width={20}  height={20}/>
                            <span>Profile</span>
                        </button>
                        <hr />
                        <button className={styles.logoutButton}>
                            <Image src={'./logout-icon.svg'} alt='logout icon' width={20}  height={20}/>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
                : null
            }
        </div>
    ); 
}