
import styles from '@/app/(login-signup)/layout.module.css'; 
import Image from 'next/image';

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.page}>
            <main>
                <section>
                    <div className={styles.appLogo}>
                        <Image src={'/Site-Logo.svg'} alt='App logo' width={50} height={50} loading='eager'/>
                        <h1>Planner</h1>
                    </div>
                    <div>
                        {children}
                    </div>
                </section>
            </main>
        </div>
    ); 
}