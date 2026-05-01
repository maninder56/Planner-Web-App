
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './shareButton.module.css'; 
import ShareButtonOptions from './shareButtonOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { UserRole } from '@/app/dashboard/Types/boardTypes';

export default function ShareButton({
    userRole, 
}: {
    userRole: UserRole; 
}) {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const viewOnlyBoard = userRole === 'Viewer'; 

    return (
        <div className={styles.wrapper}>
            <button className={styles.mainButton}
                disabled={viewOnlyBoard}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel('shareBoardOptions'); 
                }}
            >
                {/* Share logo */}
                <svg width="100px" height="100px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" transform="translate(4 2)">
                        <path d="m8.5 2.5-1.978-2-2.022 2"/>
                        <path d="m6.5.5v9"/>
                        <path d="m3.5 4.5h-1c-1.1045695 0-2 .8954305-2 2v7c0 1.1045695.8954305 2 2 2h8c1.1045695 0 2-.8954305 2-2v-7c0-1.1045695-.8954305-2-2-2h-1"/>
                    </g>
                </svg>
            </button>
        </div>
    ); 
}