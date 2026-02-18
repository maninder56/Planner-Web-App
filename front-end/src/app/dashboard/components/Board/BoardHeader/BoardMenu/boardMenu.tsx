
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './boardMenu.module.css'; 
import BoardMenuOptions from './boardMenuOptions';
import { BoardColour } from '@/app/dashboard/Types/boardTypes';
import FilterBoardOptions from '../FilterButton/filterButtonOptions';
import ShareButtonOptions from '../ShareButton/shareButtonOptions';
import ManageBoardMembersOptions from '../ManageBoardMembers/manageBoardMembersOptions';

export default function BoardMenu({
    initialBoardColour
}: {
    initialBoardColour: BoardColour; 
}) {
    const [activePanel, setActivePanel] = useActivePanel(); 

    return (
        <div className={styles.wrapper}>
            <button className={styles.mainButton}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(activePanel === 'boardMenuOptions' ? 'none' : 'boardMenuOptions'); 
                }}
            >
                {/* menu logo */}
                <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" 
                        stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" 
                        stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" 
                        stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            {
                activePanel === 'boardMenuOptions' ? 
                    <BoardMenuOptions initialBoardColour={initialBoardColour} initialFavoriteBoard={false} />
                : null
            }
            {
                activePanel === 'manageMembersOptions' ? 
                    <ManageBoardMembersOptions />
                : null
            }
            <div className={styles.smallScreenOptions}>
                {
                    activePanel === 'filterBoardOptions' ? 
                        <FilterBoardOptions />
                    : null
                }
                {
                    activePanel === 'shareBoardOptions' ? 
                        <ShareButtonOptions />
                    : null
                }
            </div>
        </div>
    ); 
}