
import styles from './boardContentLoadingSkeleton.module.css'; 

export default function BoardContentLoadingSkeleton() {
    return (
        <div className={[styles.wrapper, 'skeletonBackground'].join(' ')}>
            <ul>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
            </ul>
            <ul>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
            </ul>
            <ul>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
            </ul>
            <ul>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
            </ul>
        </div>
    ); 
}