
import CloseButton from '../Buttons/closeButton';
import styles from './hoverPanel.module.css'; 

export default function HoverPanel({
    title, 
    onCloseClick, 
    children,
}: {
    title: string; 
    onCloseClick: () => void; 
    children: React.ReactNode; 
}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.closeButton}>
                <CloseButton onClick={onCloseClick} />
            </div>
            <header>{title}</header>
            {children}
        </div>
    ); 
}