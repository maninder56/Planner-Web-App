
import { panelType } from '@/Types/UIState';
import styles from './dashboardMenu.module.css'; 
import HoverPanel from '@/Components/HoverPanels/hoverPanel';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import Image from 'next/image';

export default function DashboardMenu({
    activePanel, 
    setActivePanel,
}: {
    activePanel: panelType; 
    setActivePanel: (panel: panelType) => void; 
}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.menuButton} 
                onClick={(e) => {
                    e.stopPropagation(); 
                    setActivePanel(activePanel === 'dashboardMenuOptions' ? 'none' : 'dashboardMenuOptions'); 
                }}>
                <Image src={'./menu-icon.svg'} alt='Menu icon' width={50} height={50} />
            </div>
            {
                activePanel === 'dashboardMenuOptions' ? 
                <div className={styles.options} 
                    onClick={(e) => { e.stopPropagation(); }}>
                    <HoverPanel title='Menu' onCloseClick={() => setActivePanel('none')}>
                        <div>
                            <InnerPanelButton name='one' onClick={() => {}} />
                        </div>
                        <div>
                            <InnerPanelButton name='two' onClick={() => {}} />
                        </div>
                    </HoverPanel>
                </div>
                : null
            }
        </div>
    ); 
}