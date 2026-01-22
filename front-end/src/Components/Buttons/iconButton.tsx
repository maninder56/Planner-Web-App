
import Image from "next/image";

import styles from '@/Components/Buttons/iconButton.module.css'; 

export default function IconButton({
    iconSrc, 
    name, 
    alt,
    color, 
    disabled, 
    onClick, 
}: {
    iconSrc: string; 
    name?: string; 
    alt: string; 
    color: 'blue' | 'brown' | 'transparent'; 
    disabled?: boolean; 
    onClick: () => void | Promise<void>; 
}) {

    function createClassName() {
        let className = styles.button; 

        switch (color) {

            case 'blue': 
                className += ` ${styles.blue}`; 
                break; 
            case 'brown': 
                className += ` ${styles.brown}`; 
                break; 

            case 'transparent': 
            default: 
                className += ` ${styles.transparent}`; 
                break; 
        }
        
        return className; 
    }

    return (
        <button
            className={createClassName()}
            disabled={disabled}
            onClick={onClick}>
                <Image src={iconSrc} width={50} height={50} alt={alt} />
                {name === undefined ? null : <span>{name}</span> }
        </button>
    ); 
}