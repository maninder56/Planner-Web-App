
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import styles from './dashboardMenuOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import Image from 'next/image';

export default function DashboardMenuOptions() {
    const [activePanel, setActivePanel] = useActivePanel(); 

    return (
        <div className={styles.wrapper}>
            <HoverOptionsPanel title='Menu' onCloseClick={() => setActivePanel('none')}>
                <div className={styles.optionsList}>
                    <button onClick={e => {
                        e.stopPropagation(); 
                        setActivePanel('newBoardOptions'); 
                    }}>
                        <Image src={'./plusSign.svg'} alt='plus sign icon' width={20}  height={20}/>
                        <span>New Board</span>
                    </button>
                    <button onClick={e => {
                        e.stopPropagation(); 
                        setActivePanel('switchBoardOptions'); 
                    }}>
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
            </HoverOptionsPanel>
        </div>
    ); 
}