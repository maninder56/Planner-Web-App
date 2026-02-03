
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
}: {
    title: string; 
    onCloseClick: () => void; 
    children: React.ReactNode; 
}) {
    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.titleAndCloseButton}>
                <header>{title}</header>
                <div className={styles.closeButton}>
                    <CloseButton onClick={onCloseClick} />
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    ); 
}