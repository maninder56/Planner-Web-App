
import styles from './loading.module.css'; 

export default function Loading() {
    return (
        <div className={styles.wrapper}>
            <ul>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
            </ul>
        </div>
    ); 
}   