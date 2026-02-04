
import { useState } from 'react';
import CloseButton from '../../Buttons/closeButton';
import styles from './hoverOptionsPanel.module.css'; 



/**
 * The wrapper component needs to be relative position
 * @returns 
 */
export default function HoverOptionsPanel({
    title, 
    onCloseClick, 
    children,
    offsetZeroTo,
}: {
    title: string; 
    onCloseClick: () => void; 
    children: React.ReactNode;
    offsetZeroTo: 'right' | 'left';  
}) {
    return (
        <div className={[styles.wrapper, styles[offsetZeroTo]].join(' ')} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.titleAndCloseButton}>
                <header>{title}</header>
                <div className={styles.closeButton} onClick={e => {e.stopPropagation();}}>
                    <CloseButton onClick={onCloseClick} />
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    ); 
}