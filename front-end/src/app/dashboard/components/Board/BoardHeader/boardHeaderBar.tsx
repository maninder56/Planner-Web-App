
import styles from './boardHeaderBar.module.css'; 
import BoardNameInput from './BoardNameInput/boardNameInput';
import FavoriteBoardButton from './FavoriteBoardButton/favoriteBoardButton';

export default function BoardHeaderBar() {
    return (
        <div className={styles.wrapper}>
            <div>
                <BoardNameInput initialName='My First board' />
            </div>
            <div>
                <FavoriteBoardButton initialState={false} />
            </div>
        </div>
    ); 
}