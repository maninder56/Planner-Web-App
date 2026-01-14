import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section>
          <div>
            <p style={{fontSize:'50px'}}>Hello, how are you</p>
          </div>
        </section>
      </main>
    </div>
  );
}
