'use client'

import HoverConfirmation from '@/Components/HoverConfirmation/hoverConfirmation';
import styles from './sessionExpired.module.css'; 
import { permanentRedirect } from 'next/navigation';
import { appRoute } from '@/Types/appRoutes';

export default function SessionExpired() {
    const logInRoute: appRoute = '/login'; 
    return (
        <HoverConfirmation 
            title='Session Expired' 
            message='Your session has expired. Please log in again to continue.' 
            onConfirmName='Login' 
            onConfirm={() => {
                permanentRedirect(logInRoute); 
             }} />
    ); 
}