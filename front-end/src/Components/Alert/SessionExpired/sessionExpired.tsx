'use client'

import HoverConfirmation from '@/Components/HoverConfirmation/hoverConfirmation';
import styles from './sessionExpired.module.css'; 
import { permanentRedirect } from 'next/navigation';
import { AppRoute } from '@/Types/appRoutes';

export default function SessionExpired() {
    const logInRoute: AppRoute = '/login'; 
    return (
        <HoverConfirmation 
            className={styles.hoverConfirmation}
            title='Session Expired' 
            message='Your session has expired. Please log in again to continue.' 
            onConfirmName='Login' 
            onConfirm={() => {
                permanentRedirect(logInRoute); 
             }} />
    ); 
}