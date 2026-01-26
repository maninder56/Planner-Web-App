
import styles from './profileInfo.module.css'; 

export default function ProfileInfo({
    userInitials, 
    userName, 
    userEmail,
}: {
    userInitials: string; 
    userName: string; 
    userEmail: string; 
}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.profileIcon}>
                <header>{userInitials}</header>
            </div>
            <div className={styles.userDetails}>
                <p>{userName}</p>
                <p>{userEmail}</p>
            </div>
        </div>
    ); 
}