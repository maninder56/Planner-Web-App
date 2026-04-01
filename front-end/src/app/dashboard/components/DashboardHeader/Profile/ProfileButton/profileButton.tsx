
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './profileButton.module.css'; 
import ProfileIcon from '../ProfileIcon/profileIcon';
import { profileColour } from '@/app/dashboard/Types/UIState';
import ProfileOptions from '../ProfileOptions/ProfileOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useUserStore } from '@/app/dashboard/Store/userStore';
import ProfileButtonLoadingSkeleton from './ProfileButtonLoadingSkeleton/profileButtonLoadingSkeleton';


export default function ProfileButton() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    
    const isSwitchBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'profileOptions'); 
    const isProfileLoading = useUserStore((state) => state.isUserDataLoading); 
    const useData = useUserStore((state) => state.userData); 
    const profileColour = useUserStore((state) => state.profileIconColour); 



    if (isProfileLoading) {
        return (
            <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
                <div className={styles.mainButton}>
                    <ProfileButtonLoadingSkeleton />
                </div>
            </div>
        ); 
    }

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <button className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isSwitchBoardOptionsOpen ? 'none' : 'profileOptions'); 
                }}>
                    {
                        useData !== undefined ? 
                            <ProfileIcon userName={useData.name} colour={profileColour} /> 
                        : null
                    }
            </button>
            { isSwitchBoardOptionsOpen && (useData !== undefined) && 
                <ProfileOptions userProfile={useData} iconColour={profileColour} /> }
        </div>
    ); 
}