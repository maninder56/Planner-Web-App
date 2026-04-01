'use client'


import styles from './ProfileOptions.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';
import ProfileInfo from '../ProfileInfo/profileInfo';
import CloseButton from '@/Components/Buttons/closeButton';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import Image from 'next/image';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { UserProfile } from '@/Types/userTypes';
import { profileColour } from '@/Utilities/user';
import { permanentRedirect, redirect } from 'next/navigation';
import { AppRoute } from '@/Types/appRoutes';

export default function ProfileOptions({
    userProfile,
    iconColour,
}: {
    userProfile: UserProfile;   
    iconColour: profileColour; 
}) {

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const profileRoute: AppRoute = '/profile'; 

    return (
        <HoverOptionsPanel title='Account' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.optionsList}>
                <div>
                    <ProfileInfo userProfile={userProfile} iconColour={iconColour} />
                </div>
                <button onClick={() => {
                    permanentRedirect(profileRoute);
                }}>
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