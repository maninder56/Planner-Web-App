
import styles from './boardHeaderBar.module.css'; 
import BoardNameInput from './BoardNameInput/boardNameInput';

export default function BoardHeaderBar() {
    return (
        <div className={styles.wrapper}>
            <div>
                <BoardNameInput initialName='My First board' />
            </div>
        </div>
    ); 
}