
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import styles from './onlineUsersButtonOptions.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function OnlineUsersButtonOptions() {
    const onlineUsers = useBoardStore((state) => state.onlineUsers);
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <HoverOptionsPanel title='Online Users' offsetZeroTo={'right'} onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                <div>
                                {[...onlineUsers.values()].map((user) => (
                                    <div key={user.userId}>
                                        {user.name}
                                    </div>
                                ))}
                            </div>
            </div>
        </HoverOptionsPanel>
    ); 
}