
import CloseButton from '@/Components/Buttons/closeButton';
import styles from './bigHoverPanel.module.css'; 

export default function BigHoverPanel({
    title, 
    onCloseClick, 
    children,
}: {
    title: string; 
    onCloseClick: () => void; 
    children: React.ReactNode; 
}) {
    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); onCloseClick(); }}>
            <div className={styles.panel} onClick={e => { e.stopPropagation(); }}>
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
        </div>
    ); 
}