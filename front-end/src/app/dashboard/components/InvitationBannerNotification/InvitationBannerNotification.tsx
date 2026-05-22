
import CloseButton from '@/Components/Buttons/closeButton';
import styles from './InvitationBannerNotification.module.css'; 
import { useBoardUIStore } from '../../Store/boardUIStore';
import { useInvitationStore } from '../../Store/invitationStore';
import { useState } from 'react';

export default function InvitationBannerNotification() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const closeNotification = useInvitationStore((state) => state.closeInvitationReceivedNotification);
    const showNotification = useInvitationStore((state) => state.showInvitationReceivedNotification); 

    const [isClosing, setIsClosing] = useState(false); 

    function handleCloseClick() {
        setIsClosing(true); 
        setTimeout(() => {
            closeNotification(); 
            setIsClosing(false); 
        }, 300); // match animation duration
    }

    return (
        <div className={[styles.wrapper, 
            showNotification ? styles.showNotification : styles.hideNotification, 
            isClosing ? styles.closeNotification : ''].join(' ')}>
            <div className={styles.header}>
                <span>New Invitation</span>
                <CloseButton className={styles.closeButton} onClick={handleCloseClick} />
            </div>
            <button className={styles.inboxButton} onClick={e => {
                e.stopPropagation(); 
                setActivePanel('inboxOptionsPanel'); 
            }}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    className={styles.inboxSvg}
                    >
                    <g transform="matrix(0.083333,0,0,0.083333,0,0)">
                        <path
                        d="M220,120L160,120L140,150L100,150L80,120L20,120"
                        className={styles.inboxLine}
                        />
                    </g>

                    <g transform="matrix(0.083333,0,0,0.083333,0,0)">
                        <path
                        d="M54.5,51.1L20,120L20,180C20,190.972 29.028,200 40,200L200,200C210.972,200 220,190.972 220,180L220,120L185.5,51.1C182.128,44.314 175.178,40.004 167.6,40L72.4,40C64.822,40.004 57.872,44.314 54.5,51.1"
                        className={styles.inboxLine}
                        />
                    </g>
                    </svg>
                <span>Inbox</span>
            </button>
        </div>
    ); 
}