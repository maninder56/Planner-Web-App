
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './profileButton.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';
import { profileColour } from '@/app/dashboard/Types/UIState';
import ProfileOptions from '../ProfileOptions/ProfileOptions';


export default function ProfileButton({
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
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(activePanel === 'profileOptions' ? 'none' : 'profileOptions'); 
                }}>
                <ProfileIcon userName={userName} colour={iconColour} />
            </div>
            {
                activePanel === 'profileOptions' ? 
                <ProfileOptions userName={userName} userEmail={userEmail} iconColour={iconColour}/>
                : null
            }
        </div>
    ); 
}