

import styles from '@/Components/Inputs/formInput.module.css'; 
import { Ref } from 'react';


export default function FormInput({
    label, 
    value, 
    placeholder, 
    maxLength, 
    setValue, 
    error,
    type, 
    className, 
    inputRef, 
}: {
    label: string;
    value: string; 
    placeholder?: string; 
    maxLength: number; 
    setValue: (value: string) => void; 
    error?: string; 
    type: 'text' | 'password'; 
    className?: string; 
    inputRef?: Ref<HTMLInputElement>; 
}) {
    return (
        <div className={[styles.formInput, className ?? ''].join(' ')}>
            <label htmlFor={label}>{label}</label>
            <input 
                ref={inputRef}
                name={label}
                id={label}
                type={type}
                value={value}
                placeholder={placeholder}
                maxLength={maxLength}
                onChange={(e) => setValue(e.target.value)} 
                autoComplete='on'/>
            <div>{error}</div>
        </div>
    ); 
}