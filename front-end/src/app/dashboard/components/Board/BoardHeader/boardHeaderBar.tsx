
import { DashBoardHeaderColour } from '@/app/dashboard/Types/dashboardUI';
import styles from './boardHeaderBar.module.css'; 
import BoardNameInput from './BoardNameInput/boardNameInput';
import FavoriteBoardButton from './FavoriteBoardButton/favoriteBoardButton';
import FilterButton from './FilterButton/filterButton';
import { BoardColour } from '@/app/dashboard/Types/boardTypes';

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
                <button>Share button</button>
            </div>
            <div>
                <button>...</button>
            </div>
        </div>
    ); 
}