
import styles from './profileButtonLoadingSkeleton.module.css'; 


export default function ProfileButtonLoadingSkeleton() {
    return (
        <div className={[styles.wrapper, 'skeletonElement'].join(' ')}></div>
    ); 
}