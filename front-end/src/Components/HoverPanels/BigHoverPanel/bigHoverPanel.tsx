'use client'

import CloseButton from '@/Components/Buttons/closeButton';
import styles from './bigHoverPanel.module.css'; 
import { useState } from 'react';

export default function BigHoverPanel({
    title, 
    onCloseClick, 
    children,
}: {
    title: string; 
    onCloseClick: () => void; 
    children: React.ReactNode; 
}) {
    const [closing, setClosing] = useState(false); 

    function handleClose() {
        setClosing(true); 
        setTimeout(onCloseClick, 200); // match animation duration
    }

    return (
        <div className={[styles.wrapper, closing ? styles.fadeOut : ''].join(' ')} 
            onClick={e => { 
                e.stopPropagation(); 
                handleClose(); 
            }}>
            <div className={[styles.panel, closing ? styles.slideOut: ''].join(' ')} 
                onClick={e => { e.stopPropagation(); }}>
                <div className={styles.titleAndCloseButton}>
                    <header>{title}</header>
                    <div className={styles.closeButton} onClick={e => {e.stopPropagation();}}>
                        <CloseButton onClick={handleClose} />
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    ); 
}