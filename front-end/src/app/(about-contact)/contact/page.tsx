
import Link from 'next/link';
import styles from './page.module.css'; 

export default function Page() {
    return (
        <div className={styles.wrapper}>
            <header>Contact</header>
            <p>
                I'm always interested in feedback, collaboration opportunities, and
                discussing web development. If you'd like to learn more about this project
                or my work, I'd be happy to hear from you.
            </p>

            <p>Email: maninder123450@gmail.com</p>

            <a href='https://github.com/maninder56' target="_blank" rel="noopener noreferrer">GitHub</a>

            <a href='https://www.linkedin.com/in/manindersingh55/' target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
    ); 
}