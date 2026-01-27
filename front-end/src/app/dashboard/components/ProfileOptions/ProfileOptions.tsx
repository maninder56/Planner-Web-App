'use client'

import { panelType, profileColour } from '@/Types/UIState';
import IconButton from '@/Components/Buttons/iconButton';

import styles from './ProfileOptions.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';
import ProfileInfo from '../ProfileInfo/profileInfo';

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
        <div className={styles.wrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel(activePanel === 'profileOptions' ? 'none' : 'profileOptions'); 
            }}>
            <ProfileIcon userName={userName} colour={iconColour} />
            {
                activePanel === 'profileOptions' ? 
                <div className={styles.options}>
                    <IconButton iconSrc='./Cross-sign.svg' alt='cross sign' color='transparent' onClick={() => setActivePanel('none')} />
                    <header>Account</header>
                    <ProfileInfo userName={userName} userEmail={userEmail} iconColour={iconColour} />
                    <div>
                        <button>Profile</button>
                        <button>Log out</button>
                    </div>
                </div>
                :null
            }
        </div>
    ); 
}