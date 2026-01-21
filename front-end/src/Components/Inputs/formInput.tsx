

import styles from '@/Components/Inputs/formInput.module.css'; 


export default function FormInput({
    label, 
    value, 
    placeholder, 
    maxLength, 
    setValue, 
    error,
}: {
    label: string;
    value: string; 
    placeholder?: string; 
    maxLength: number; 
    setValue: (value: string) => void; 
    error?: string; 
}) {
    return (
        <div className={styles.fromInput}>
            <label htmlFor={label}>{label}</label>
            <input 
                name={label}
                id={label}
                type='text'
                value={value}
                placeholder={placeholder}
                maxLength={maxLength}
                onChange={(e) => setValue(e.target.value)} />
            <div>{error}</div>
        </div>
    ); 
}