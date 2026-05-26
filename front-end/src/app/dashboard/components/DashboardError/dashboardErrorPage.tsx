'use client'

import Link from 'next/link';
import styles from './dashboardErrorPage.module.css'; 
import { AppRoute } from '@/Types/appRoutes';
import { useRouter } from 'next/navigation'
 

 
export default function DashboardErrorPage({
  onTryAgainClick,
}: {
  onTryAgainClick: () => void; 
}) {
  const homePage: AppRoute = '/'; 

  return (
    <div className={styles.wrapper}>
      <h2>Something went wrong!</h2>
      <p>Please try again or return to the home page.</p>
      <button className='button red' onClick={onTryAgainClick}>Try again</button>
      <Link href={homePage} className='button red'>Home</Link>
    </div>
  )
}