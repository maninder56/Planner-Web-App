
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
    color: 'blue' | 'grey' | 'transparent'; 
    disabled?: boolean; 
    onClick: () => void | Promise<void>; 
}) {
    return (
        <button
            className={[styles.button, styles[color]].join(' ')}
            disabled={disabled}
            onClick={onClick}>
                <Image src={iconSrc} width={50} height={50} alt={alt} />
                {name === undefined ? null : <span>{name}</span> }
        </button>
    ); 
}