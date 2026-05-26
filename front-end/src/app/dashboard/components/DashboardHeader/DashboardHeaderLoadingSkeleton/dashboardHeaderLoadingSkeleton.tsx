
import styles from './dashboardHeaderLoadingSkeleton.module.css'; 


export default function DashboardHeaderLoadingSkeleton() {
    return (
        <section className={styles.wrapper}>
            <div className={`${styles.logoElement} skeletonElement`}></div>
            <div className={`${styles.searchElement} skeletonElement`}></div>
            <div className={`${styles.menuElement} skeletonElement`}></div>
        </section>
    ); 
}