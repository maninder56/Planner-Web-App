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

export default function BoardHeaderBar() {
    const boardColour = useBoardStore((state) => state.boardData?.boardColour); 

    if (boardColour === undefined) {
        return <p>No data found</p>
    }

    return (
        <div className={[styles.wrapper, styles[boardColour]].join(' ')}>
            <div className={styles.boardNameContainer}>
                <BoardNameInput initialName='My First board' />
            </div>
            <div className={styles.barOptionList}>
                <div className='boardHeaderBarOptionsVisibilityForBigScreen'>
                    <div>
                        <FavoriteBoardButton initialState={false} />
                    </div>
                    <div>
                        <FilterButton />
                    </div>
                    <div>
                        <ShareButton />
                    </div>
                </div>
                <div>
                    <BoardMenu initialBoardColour={boardColour} />
                </div>
            </div>
        </div>
    ); 
}