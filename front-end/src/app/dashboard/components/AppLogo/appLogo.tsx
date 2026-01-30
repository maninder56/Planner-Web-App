
import Image from 'next/image';
import styles from './appLogo.module.css'; 

export default function AppLogo() {
    return (
        <div className={styles.wrapper}>
            <Image src={'/Site-Logo.svg'} alt='App logo' width={50} height={50} loading='eager'/>
            <header>Planner</header>
        </div>
    ); 
}