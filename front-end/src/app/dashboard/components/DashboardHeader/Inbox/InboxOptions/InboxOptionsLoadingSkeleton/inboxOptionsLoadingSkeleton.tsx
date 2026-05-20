


// InboxOptionsLoadingSkeleton.jsx
import styles from './inboxOptionsLoadingSkeleton.module.css';

export default function InboxOptionsLoadingSkeleton() {
    return (
        <ul className={styles.wrapper}>
            {Array.from({ length: 3 }).map((_, index) => (
                <li key={index} className={styles.card}>
                    <div className={styles.inviteInfo}>
                        <div className={`${styles.boardName} skeletonElement`}></div>

                        <div className={`${styles.invitedBy} skeletonElement`}></div>

                        <div className={styles.meta}>
                            <div className={`${styles.metaItem} skeletonElement`}></div>
                            <div className={`${styles.metaItem} skeletonElement`}></div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.buttons}>
                            <div className={`${styles.button} skeletonElement`}></div>
                            <div className={`${styles.button} skeletonElement`}></div>
                        </div>

                        <div className={`${styles.expireText} skeletonElement`}></div>
                    </div>
                </li>
            ))}
        </ul>
    );
}