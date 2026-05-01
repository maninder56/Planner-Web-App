'use client'

import { DashBoardHeaderColour } from '@/app/dashboard/Types/dashboardUI';
import styles from './boardHeaderBar.module.css'; 
import BoardNameInput from './BoardNameInput/boardNameInput';
import FavoriteBoardButton from './FavoriteBoardButton/favoriteBoardButton';
import FilterButton from './FilterButton/filterButton';
import { BoardColour } from '@/app/dashboard/Types/boardTypes';
import ShareButton from './ShareButton/shareButton';
import BoardMenu from './BoardMenu/boardMenu';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { LastUsedBoardRequest } from '@/app/dashboard/Services/boardService';
import { NormaliseBoardData } from '@/app/dashboard/Utilities/boardData';
import BoardHeaderSkeleton from './BoardHeaderSkeleton/boardHeaderSkeleton';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import ShareButtonOptions from './ShareButton/shareButtonOptions';

export default function BoardHeaderBar() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const boardData = useBoardStore((state) => state.currentBoardData); 
    const isShareBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'shareBoardOptions'); 

    if (isBoardLoading) {
        return <BoardHeaderSkeleton />
    } else if (boardData === undefined) {
        return (
            <div className={[styles.wrapper, styles.noBoardSelected].join(' ')}></div>
        ); 
    }

    const viewOnly = boardData.role === 'Viewer'; 

    return (
        <div className={[styles.wrapper, styles[boardData.boardColour]].join(' ')}>
            <div className={styles.boardNameContainer}>
                <BoardNameInput initialName={boardData.title} boardId={boardData.id} userRole={boardData.role} />
            </div>
            <div className={styles.barOptionList}>
                <div>
                    <FilterButton />
                </div>
                <div className='boardHeaderBarOptionsVisibilityForBigScreen'>
                    <div>
                        <FavoriteBoardButton boardId={boardData.id} userRole={boardData.role} />
                    </div>
                    <div>
                        <ShareButton userRole={boardData.role}/>
                    </div>
                </div>
                <div>
                    <BoardMenu initialBoardColour={boardData.boardColour} boardId={boardData.id} userRole={boardData.role} />
                </div>
            </div>
            { isShareBoardOptionsOpen && <ShareButtonOptions />}
        </div>
    ); 
}