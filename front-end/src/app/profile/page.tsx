
import styles from './page.module.css'; 

export default function Page () {

    // await new Promise(r => setTimeout(r, 5000)); 

    return (
        <div className={styles.wrapper}>
            <h1>Profile</h1>
        </div>
    ); 
}