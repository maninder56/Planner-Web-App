import { panelType } from '@/Types/UIState';
import IconButton from '@/Components/Buttons/iconButton';

import styles from './ProfileOptions.module.css'; 

export default function ProfileOptions({
    userName,
    activePanel, 
    setActivePanel,
}: {
    userName: string; 
    activePanel: panelType
    setActivePanel: (panel: panelType) => void; 
}) {
    function getUserInitials() {
        try {
            const nameArray = userName.split(' '); 
            if (nameArray.length === 0) {
                return 'U'; 
            } else if (nameArray.length === 1) {
                return nameArray[0][0]; 
            } else {
                return nameArray[0][0] + nameArray[nameArray.length - 1][0]; 
            }
        } catch {
            console.error('Failed to get user Initials'); 
            return 'U'; 
        }
    }

    return (
        <div className={styles.wrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel(activePanel === 'profileOptions' ? 'none' : 'profileOptions'); 
            }}>
            <div className={styles.profileIcon}>
                <header>{getUserInitials()}</header>
            </div>
            {
                activePanel === 'profileOptions' ? 
                <div className={styles.options}>
                    <IconButton iconSrc='./Cross-sign' alt='cross sign' color='transparent' onClick={() => setActivePanel('none')} />
                    <header>Account</header>
                </div>
                :null
            }
        </div>
    ); 
}