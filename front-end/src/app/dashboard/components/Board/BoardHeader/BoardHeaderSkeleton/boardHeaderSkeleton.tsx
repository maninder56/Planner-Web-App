
import styles from './boardHeaderSkeleton.module.css'; 

export default function BoardHeaderSkeleton() {
    return (
        <div className={[styles.wrapper, 'skeletonBackground'].join(' ')}>
            <div className={[styles.boardNameContainer, 'skeletonElement'].join(' ')}>
            </div>
        </div>
    );
}