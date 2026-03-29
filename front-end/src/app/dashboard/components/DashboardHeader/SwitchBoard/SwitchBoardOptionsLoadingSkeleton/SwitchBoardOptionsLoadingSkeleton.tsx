
import styles from './SwitchBoardOptionsLoadingSkeleton.module.css'; 


export default function SwitchBoardOptionsLoadingSkeleton() {
    const boardArray = [1, 2, 3, 4, 5, 6, 7, 8 , 9];

    return (
        <div className={[styles.wrapper, 'skeletonBackground'].join(' ')}>
            <div className={styles.search}>
                <div className='skeletonElement'></div>
            </div>
            <div className={styles.boards}>
                {
                    boardArray.map((i) => {
                        return (
                            <div key={i} className='skeletonElement'></div>
                        ); 
                    })
                }
            </div>   
        </div>
    ); 
}