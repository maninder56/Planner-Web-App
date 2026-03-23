
import styles from './board.module.css'; 
import BoardContent from './BoardContent/boardContent';
import BoardHeaderBar from './BoardHeader/boardHeaderBar';

export default function Board() {
    // make board request
    return (
        <main className={styles.mainContent}>
            <section>
                <BoardHeaderBar />
            </section>
            <section>
                <BoardContent />
            </section>
        </main>
    ); 
}