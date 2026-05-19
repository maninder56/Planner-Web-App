
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import styles from './inboxButton.module.css'; 
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useInvitationStore } from '@/app/dashboard/Store/invitationStore';

export default function InboxButton() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const invitations = useInvitationStore((state) => state.invitations); 

    return (
        <button className={styles.wrapper} disabled={isBoardLoading} onClick={e => {
            e.stopPropagation(); 
            setActivePanel('inboxOptionsPanel'); 
        }}>
            <svg
                width="100%"
                height="100%"
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
                {
                    invitations.length === 0 ? null : 
                    <g transform="matrix(0.87127,0,0,0.867115,10.218253,-0.671147)">
                        <ellipse
                            cx="6.636"
                            cy="5.387"
                            rx="4.591"
                            ry="4.613"
                            className={styles.inboxDot}
                        />
                    </g>
                }
                </svg>
            <span>Inbox</span>
        </button>
    ); 
}