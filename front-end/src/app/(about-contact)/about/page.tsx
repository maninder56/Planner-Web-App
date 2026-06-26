

import Link from 'next/link';
import styles from './page.module.css'; 

export default function Page() {
    return (
        <div className={styles.wrapper}>
            <header>About Planner</header>
            <p>
                Planner is a project management web application built to
                demonstrate my full-stack development skills using ASP.NET Core
                and Next.js.
            </p>

            <p>
                The application allows users to organize projects, manage tasks,
                and collaborate with others. A Guest Account with sample data is
                also available for anyone who wants to explore the application
                without creating an account.
            </p>

            <p>
                This project showcases REST API development, authentication,
                database integration, and a responsive user interface built with
                modern web technologies.
            </p>
        </div>
    ); 
}