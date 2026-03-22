
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './profileButton.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';
import { profileColour } from '@/app/dashboard/Types/UIState';
import ProfileOptions from '../ProfileOptions/ProfileOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';


export default function ProfileButton({
    userName,
    userEmail,
    iconColour,
}: {
    userName: string; 
    userEmail: string;
    iconColour: profileColour; 
}) {
    const isSwitchBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'profileOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isSwitchBoardOptionsOpen ? 'none' : 'profileOptions'); 
                }}>
                <ProfileIcon userName={userName} colour={iconColour} />
            </div>
            {
                isSwitchBoardOptionsOpen ? 
                <ProfileOptions userName={userName} userEmail={userEmail} iconColour={iconColour}/>
                : null
            }
        </div>
    ); 
}