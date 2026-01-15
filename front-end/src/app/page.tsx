import Image from "next/image";
import styles from "./page.module.css";
import Button from "@/Components/Buttons/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.appHeading}>
          <Image src={'/Site-Logo.svg'} alt='App logo' width={50} height={50} loading='eager'/>
          <h1>Planner</h1>
        </div>
        <div>
          <Link href={'/login'} className="button transparent" >Log in</Link>
        </div>
        <div>
          <Link href={'/signup'} className="button red">Sign up</Link>
        </div>
      </header>

      <main className={styles.main}>
        
      </main>
      <footer>

      </footer>
    </div>
  );
}
