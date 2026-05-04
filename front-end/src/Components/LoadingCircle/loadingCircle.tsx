
import styles from './loadingCircle.module.css'; 

export default function LoadingCircle({
    colour, 
}: {
    colour: 'grey' | 'white' | 'black'; 
}) {
    return (
        <div className={[styles.loader, styles[colour]].join(' ')}></div>
    ); 
}