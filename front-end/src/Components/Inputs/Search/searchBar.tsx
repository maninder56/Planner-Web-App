
import { FocusEventHandler, RefObject } from 'react';
import styles from './searchBar.module.css'; 

export default function SearchBar({
    inputRef, 
    placeHolder, 
    maxLenght, 
    disabled,
    value, 
    onBlur,
    setValue,
}: {
    inputRef?: RefObject<HTMLInputElement | null>; 
    placeHolder?: string;  
    maxLenght?: number; 
    disabled?: boolean; 
    value: string; 
    setValue: (newValue: string) => void; 
    onBlur?: FocusEventHandler<HTMLInputElement>;
}) {
    return (
        <div className={styles.wrapper}>
            <svg fill="none" viewBox="4.75 4.25 15.5 15.5">
                <path clipRule="evenodd" d="M5.5 10.766a5.765 5.765 0 1 1 11.53 0 5.765 5.765 0 0 1-11.53 0" 
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.029 16.53 19.5 19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
                ref={inputRef}
                type='text'
                maxLength={maxLenght === undefined ? 100 : maxLenght}
                placeholder={placeHolder === undefined ? 'Search': placeHolder}
                onBlur={onBlur}
                value={value}
                disabled={disabled}
                onChange={e => setValue(e.target.value)} />
        </div>
    ); 
}