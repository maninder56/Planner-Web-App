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
            <svg height="50" width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M37.5 12.5v75h25v-75zm-4.167 0h-18.75a6.25 6.25 0 0 0-6.25 6.25v62.5a6.25 6.25 0 0 0 6.25 6.25h18.75zm33.334 0v75h18.75a6.25 6.25 0 0 0 6.25-6.25v-62.5a6.25 6.25 0 0 0-6.25-6.25zm-62.5 6.25c0-5.752 4.663-10.417 10.416-10.417h70.834c5.753 0 10.416 4.665 10.416 10.417v62.5c0 5.752-4.663 10.417-10.416 10.417H14.583c-5.753 0-10.416-4.665-10.416-10.417zm12.5 6.25H25a4.167 4.167 0 0 1 4.167 4.167v4.166A4.167 4.167 0 0 1 25 37.5h-8.333a4.167 4.167 0 0 1-4.167-4.167v-4.166A4.167 4.167 0 0 1 16.667 25m0 16.667H25a4.167 4.167 0 0 1 4.167 4.166V50A4.167 4.167 0 0 1 25 54.167h-8.333A4.167 4.167 0 0 1 12.5 50v-4.167a4.167 4.167 0 0 1 4.167-4.166M45.833 25h8.334a4.167 4.167 0 0 1 4.166 4.167v4.166a4.167 4.167 0 0 1-4.166 4.167h-8.334a4.167 4.167 0 0 1-4.166-4.167v-4.166A4.167 4.167 0 0 1 45.833 25M75 25h8.333a4.167 4.167 0 0 1 4.167 4.167v4.166a4.167 4.167 0 0 1-4.167 4.167H75a4.167 4.167 0 0 1-4.167-4.167v-4.166A4.167 4.167 0 0 1 75 25m0 16.667h8.333a4.167 4.167 0 0 1 4.167 4.166V50a4.167 4.167 0 0 1-4.167 4.167H75A4.167 4.167 0 0 1 70.833 50v-4.167A4.167 4.167 0 0 1 75 41.667m0 16.666h8.333A4.167 4.167 0 0 1 87.5 62.5v4.167a4.167 4.167 0 0 1-4.167 4.166H75a4.167 4.167 0 0 1-4.167-4.166V62.5A4.167 4.167 0 0 1 75 58.333M16.667 29.167v4.166H25v-4.166zm0 16.666V50H25v-4.167zm29.166-16.666v4.166h8.334v-4.166zm29.167 0v4.166h8.333v-4.166zm0 16.666V50h8.333v-4.167zM75 62.5v4.167h8.333V62.5zM14.583 20.833a2.084 2.084 0 0 1 0-4.166h12.5a2.083 2.083 0 0 1 0 4.166zm29.167 0a2.084 2.084 0 0 1 0-4.166h12.5a2.084 2.084 0 0 1 0 4.166zm29.167 0a2.083 2.083 0 0 1 0-4.166h12.5a2.084 2.084 0 0 1 0 4.166z" 
                fill="#000"/>
            </svg>
            <h1>Planner</h1>
          </div>
          <div className={styles.headerButtons}>
            <div>
              <Link href={'/login'} className='button transparent'>Log in</Link>
            </div>
            <div>
              <Link href={'/signup'} className='button red'>Sign up</Link>
            </div>
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
          <div className={styles.footerAppHeading}>
            <svg height="50" width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M37.5 12.5v75h25v-75zm-4.167 0h-18.75a6.25 6.25 0 0 0-6.25 6.25v62.5a6.25 6.25 0 0 0 6.25 6.25h18.75zm33.334 0v75h18.75a6.25 6.25 0 0 0 6.25-6.25v-62.5a6.25 6.25 0 0 0-6.25-6.25zm-62.5 6.25c0-5.752 4.663-10.417 10.416-10.417h70.834c5.753 0 10.416 4.665 10.416 10.417v62.5c0 5.752-4.663 10.417-10.416 10.417H14.583c-5.753 0-10.416-4.665-10.416-10.417zm12.5 6.25H25a4.167 4.167 0 0 1 4.167 4.167v4.166A4.167 4.167 0 0 1 25 37.5h-8.333a4.167 4.167 0 0 1-4.167-4.167v-4.166A4.167 4.167 0 0 1 16.667 25m0 16.667H25a4.167 4.167 0 0 1 4.167 4.166V50A4.167 4.167 0 0 1 25 54.167h-8.333A4.167 4.167 0 0 1 12.5 50v-4.167a4.167 4.167 0 0 1 4.167-4.166M45.833 25h8.334a4.167 4.167 0 0 1 4.166 4.167v4.166a4.167 4.167 0 0 1-4.166 4.167h-8.334a4.167 4.167 0 0 1-4.166-4.167v-4.166A4.167 4.167 0 0 1 45.833 25M75 25h8.333a4.167 4.167 0 0 1 4.167 4.167v4.166a4.167 4.167 0 0 1-4.167 4.167H75a4.167 4.167 0 0 1-4.167-4.167v-4.166A4.167 4.167 0 0 1 75 25m0 16.667h8.333a4.167 4.167 0 0 1 4.167 4.166V50a4.167 4.167 0 0 1-4.167 4.167H75A4.167 4.167 0 0 1 70.833 50v-4.167A4.167 4.167 0 0 1 75 41.667m0 16.666h8.333A4.167 4.167 0 0 1 87.5 62.5v4.167a4.167 4.167 0 0 1-4.167 4.166H75a4.167 4.167 0 0 1-4.167-4.166V62.5A4.167 4.167 0 0 1 75 58.333M16.667 29.167v4.166H25v-4.166zm0 16.666V50H25v-4.167zm29.166-16.666v4.166h8.334v-4.166zm29.167 0v4.166h8.333v-4.166zm0 16.666V50h8.333v-4.167zM75 62.5v4.167h8.333V62.5zM14.583 20.833a2.084 2.084 0 0 1 0-4.166h12.5a2.083 2.083 0 0 1 0 4.166zm29.167 0a2.084 2.084 0 0 1 0-4.166h12.5a2.084 2.084 0 0 1 0 4.166zm29.167 0a2.083 2.083 0 0 1 0-4.166h12.5a2.084 2.084 0 0 1 0 4.166z" 
                fill="#000"/>
            </svg>
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
      </footer>
    </div>
  );
}
