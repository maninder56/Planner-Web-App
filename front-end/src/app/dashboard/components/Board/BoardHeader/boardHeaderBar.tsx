
import { DashBoardHeaderColour } from '@/app/dashboard/Types/dashboardUI';
import styles from './boardHeaderBar.module.css'; 
import BoardNameInput from './BoardNameInput/boardNameInput';
import FavoriteBoardButton from './FavoriteBoardButton/favoriteBoardButton';
import FilterButton from './FilterButton/filterButton';

export default function BoardHeaderBar({
    colourType,
}: {
    colourType: DashBoardHeaderColour; 
}) {
    return (
        <div className={[styles.wrapper, styles[colourType]].join(' ')}>
            <div>
                <BoardNameInput initialName='My First board' />
            </div>
            <div>
                <FavoriteBoardButton initialState={false} />
            </div>
            <div>
                <FilterButton />
            </div>
        </div>
    ); 
}