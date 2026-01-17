'use client'

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
          <Link href={'/login'} className='button transparent'>Log in</Link>
        </div>
        <div>
          <Link href={'/signup'} className='button red'>Sign up</Link>
        </div>
      </header>
      <main className={styles.main}>
        <section>
          <div>
            <div>
              <p>Have a bunch of to-dos and can&apos;t decide where to start?</p>
              <p>No worries — we have a solution. Start planning your project with our planner.</p>
            </div>
            <div>
              <Link href={'/signup'} className='button red'>Sign up</Link>
            </div>
            <div>
              <p>don&apos;t want to create an account?, then just create an guest account.</p>
            </div>
            <div>
              <Button name='Guest' color='red' onClick={() => {}} />
            </div>
          </div>
          <div>
            <div>
              <Image src={'/no-image.svg'}  alt='Dashboard image' width={100} height={100} loading='eager' />
            </div>
            <div>
              <p>
                This is a demo web application, Please do not enter any private or sensitive information. 
                You can explore the app using a Guest Account with auto-generated sample data.
              </p>
              <p>Please note that guest accounts are intended for temporary use and are not retained for extended periods.</p>
            </div>
          </div>
        </section>
      </main>
      <footer>

      </footer>
    </div>
  );
}
