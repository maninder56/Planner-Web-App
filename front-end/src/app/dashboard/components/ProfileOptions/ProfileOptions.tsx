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

    return (
        <div className={styles.wrapper}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel(activePanel === 'profileOptions' ? 'none' : 'profileOptions'); 
            }}>
            <div className={styles.profileIcon}>
                <header>-+</header>
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