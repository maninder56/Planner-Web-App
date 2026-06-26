
import Link from 'next/link';
import styles from './layout.module.css'; 

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.page}>
            <main>
                <section>
                    <div className={styles.content}>
                        {children}
                    </div>
                    <div className={styles.homeLink}>
                        <Link href={'/'} className='button red'>Home</Link>
                    </div>
                </section>
            </main>
        </div>
    ); 
}