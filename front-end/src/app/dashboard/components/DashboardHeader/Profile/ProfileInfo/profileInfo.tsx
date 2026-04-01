
import { profileColour } from '@/app/dashboard/Types/UIState';
import ProfileIcon from '../../../DashboardHeader/Profile/ProfileIcon/profileIcon';
import styles from './profileInfo.module.css'; 
import { UserProfile } from '@/Types/userTypes';
import { useParams } from 'next/navigation';

export default function ProfileInfo({
    userProfile, 
    iconColour,
}: {
    userProfile: UserProfile
    iconColour: profileColour;
}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.iconWrapper}>
                <ProfileIcon userName={userProfile.name} colour={iconColour} />
            </div>
            <div className={styles.userDetails}>
                <p>{userProfile.name}</p>
                <p>{userProfile.email}</p>
            </div>
        </div>
    ); 
}