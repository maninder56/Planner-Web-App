'use client'

import { panelType, profileColour } from '@/app/dashboard/Types/UIState';
import IconButton from '@/Components/Buttons/iconButton';

import styles from './ProfileOptions.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';
import ProfileInfo from '../ProfileInfo/profileInfo';
import CloseButton from '@/Components/Buttons/closeButton';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import Image from 'next/image';

export default function ProfileOptions({
    userName,
    userEmail,
    iconColour,
}: {
    userName: string;
    userEmail: string;  
    iconColour: profileColour; 
}) {

    const [activePanel, setActivePanel] = useActivePanel(); 

    return (
        <HoverOptionsPanel title='Account' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.optionsList}>
                <div>
                    <ProfileInfo userName={userName} userEmail={userEmail} iconColour={iconColour} />
                </div>
                <button>
                    <Image src={'./profile-icon.svg'} alt='profile icon' width={20}  height={20}/>
                    <span>Profile</span>
                </button>
                <hr />
                <button>
                    <Image src={'./logout-icon.svg'} alt='logout icon' width={20}  height={20}/>
                    <span>Logout</span>
                </button>
            </div>
        </HoverOptionsPanel>
    ); 
}