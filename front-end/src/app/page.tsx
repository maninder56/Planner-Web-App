'use client'

import Image from "next/image";
import styles from "./page.module.css";
import Button from "@/Components/Buttons/button";
import Link from "next/link";
import AppFeaturesTabbedNavigation from "./components/appFeaturesTabbedNavigation";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.headerWrapper}>
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
      </div>
      <main className={styles.main}>
        <section className={styles.firstSection}>
          <div className={styles.firstSectionContainer}>
            <div className={styles.childOne}>
              <div className={styles.introduction}>
                <p>Have a bunch of to-dos and can&apos;t decide where to start?</p>
                <p>No worries — we have a solution. Start planning your project with our planner.</p>
              </div>
              <div className={styles.signupLink}>
                <Link href={'/signup'} className='button red'>Sign up</Link>
              </div>
              <div className={styles.guestInfo}>
                <p>don&apos;t want to create an account?, then just create an guest account.</p>
              </div>
              <div className={styles.guestButton}>
                <Button name='Guest' color='black' onClick={() => {}} />
              </div>
            </div>
            <div className={styles.childTwo}>
              <div className={styles.appPhoto}>
                <Image src={'/mockImage.jpg'}  alt='Dashboard image' width={1920} height={1200} loading='eager' />
              </div>
              <div className={styles.guestAccountInfo}>
                <p>
                  This is a demo web application, Please do not enter any private or sensitive information. 
                  You can explore the app using a Guest Account with auto-generated sample data.
                </p>
                <p>Please note that guest accounts are intended for temporary use and are not retained for extended periods.</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.secondSection}>
          <header>What can I do?</header>
          <AppFeaturesTabbedNavigation />
        </section>
        <section className={styles.thirdSection}>
          <div>
            <div className={styles.contentWrapper}>
              <header>Start Your planning</header>
              <div className={styles.contentGrid}>
                <div className={styles.signupLinkContainer}>
                  <Link href={'/signup'} className='button red'>Sign up</Link>
                </div>
                <p>Signing up will alow you to invite other members, so you can work together on a project</p>
                <p>Or create a guest account to try the planner without needing an account. But you won&apos;t be able to invite or collaborate with other members</p>
                <div className={styles.guestButtonContainer}>
                  <Button name='Guest' color='black' onClick={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div>
          <div className={styles.footerWrapper}>
            <div className={styles.appHeading}>
              <Image src={'/Site-Logo.svg'} alt='App logo' width={50} height={50} loading='eager'/>
              <h1>Planner</h1>  
            </div>
            <div>
              <div>
                <Link href={'/login'} className='button'>About Planner</Link>
              </div>
            </div>
            <div>
              <div>
                <Link href={'/login'} className='button'>Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
