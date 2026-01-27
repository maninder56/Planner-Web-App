'use client'

import { panelType, profileColour } from '@/Types/UIState';
import IconButton from '@/Components/Buttons/iconButton';

import styles from './ProfileOptions.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';
import ProfileInfo from '../ProfileInfo/profileInfo';
import ClosePanelButton from '@/Components/Buttons/closePanelButton';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';

export default function ProfileOptions({
    userName,
    userEmail,
    iconColour,
    activePanel, 
    setActivePanel,
}: {
    userName: string;
    userEmail: string;  
    iconColour: profileColour; 
    activePanel: panelType
    setActivePanel: (panel: panelType) => void; 
}) {
    return (
        <>
        <div className={styles.wrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel(activePanel === 'profileOptions' ? 'none' : 'profileOptions'); 
            }}>
            <ProfileIcon userName={userName} colour={iconColour} />
        </div>
        {
            activePanel === 'profileOptions' ? 
            <div className={styles.options}
                onClick={(e) => {
                    e.stopPropagation(); 
                }}>
                <div className={styles.closeButton}>
                    <ClosePanelButton onClick={() => setActivePanel('none')} />
                </div>
                <header>Account</header>
                <ProfileInfo userName={userName} userEmail={userEmail} iconColour={iconColour} />
                <div className={styles.buttons}>
                    <div>
                        <InnerPanelButton name='Profile' onClick={() => {}} />
                    </div>
                    <div className={styles.logoutButton}>
                        <InnerPanelButton name='Log out' onClick={() => {}} />
                    </div>
                </div>
            </div>
            :null
        }
        </>
    ); 
}