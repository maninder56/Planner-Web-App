import { panelType } from '@/Types/UIState';

import styles from './profileIcon.module.css'; 

export default function ProfileIcon({
    userName,
    activePanel, 
    setActivePanel,
}: {
    userName: string; 
    activePanel: panelType
    setActivePanel: (panel: panelType) => void; 
}) {
    const nameArray = userName.split(' '); 
    const i = nameArray[0].concat(nameArray[nameArray.length - 1]); 

    return (
        <div className={styles.wrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel(activePanel === 'profileOptions' ? 'none' : 'profileOptions'); 
            }}>
            <div className={styles.profileIcon}>
                
            </div>
        </div>
    ); 
}