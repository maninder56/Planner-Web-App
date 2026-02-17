
import { DashBoardHeaderColour } from '@/app/dashboard/Types/dashboardUI';
import styles from './boardHeaderBar.module.css'; 
import BoardNameInput from './BoardNameInput/boardNameInput';
import FavoriteBoardButton from './FavoriteBoardButton/favoriteBoardButton';
import FilterButton from './FilterButton/filterButton';
import { BoardColour } from '@/app/dashboard/Types/boardTypes';
import ShareButton from './ShareButton/shareButton';
import BoardMenu from './BoardMenu/boardMenu';

export default function BoardHeaderBar({
    boardColour, 
}: {
    boardColour: BoardColour; 
}) {
    return (
        <div className={[styles.wrapper, styles[boardColour]].join(' ')}>
            <div>
                <BoardNameInput initialName='My First board' />
            </div>
            <div>
                <FavoriteBoardButton initialState={false} />
            </div>
            <div>
                <FilterButton />
            </div>
            <div>
                <ShareButton />
            </div>
            <div>
                <BoardMenu />
            </div>
        </div>
    ); 
}