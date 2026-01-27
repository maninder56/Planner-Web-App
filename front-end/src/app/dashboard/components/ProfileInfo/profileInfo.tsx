
import { profileColour } from '@/Types/UIState';
import ProfileIcon from '../ProfileIcon/profileIcon';
import styles from './profileInfo.module.css'; 

export default function ProfileInfo({
    userName, 
    userEmail,
    iconColour,
}: {
    userName: string; 
    userEmail: string; 
    iconColour: profileColour;
}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.iconWrapper}>
                <ProfileIcon userName={userName} colour={iconColour} />
            </div>
            <div className={styles.userDetails}>
                <p>{userName}</p>
                <p>{userEmail}</p>
            </div>
        </div>
    ); 
}