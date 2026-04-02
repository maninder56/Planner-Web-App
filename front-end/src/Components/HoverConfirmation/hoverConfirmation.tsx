
import { useState } from 'react';
import styles from './hoverConfirmation.module.css'; 
import Button from '../Buttons/button';

export default function HoverConfirmation({
    title, 
    message,
    onCancel, 
    onConfirmName,
    onConfirm,
    confirmationError,
}: {
    title: string; 
    message: string; 
    onCancel?: () => void;
    onConfirmName: string;  
    onConfirm: () => Promise<void> | void; 
    confirmationError?: string; 
}) {

    const [buttonDisabled, setButtonDisabled] = useState(false); 

    async function handleOnConfirm() {
        setButtonDisabled(true); 

        try {
            await onConfirm(); 
        } finally {
            setButtonDisabled(false); 
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.confirmation}>
                <header>{title}</header>
                <p className={styles.confirmationError}>{confirmationError}</p>
                <p>{message}</p>
                <div className={styles.buttons}>
                    {
                        onCancel !== undefined ? 
                        <button className={`button transparent light-outline`} onClick={() => onCancel()} disabled={buttonDisabled}>Cancel</button>
                        : null 
                    }
                    <Button name={onConfirmName} color='red' onClick={handleOnConfirm} disabled={buttonDisabled} />
                </div>
            </div>
        </div>
    ); 
}