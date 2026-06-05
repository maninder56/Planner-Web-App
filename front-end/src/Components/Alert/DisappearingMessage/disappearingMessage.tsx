
import { useEffect, useState } from 'react';
import styles from './disappearingMessage.module.css'; 

export default function DisappearingMessage({
    message, 
    setMessage, 
    durationInSeconds,
    className, 
}: {
    message?: string; 
    setMessage: (newMessage?: string) => void; 
    durationInSeconds: number; 
    className?: string, 
}) {
    const defaultDuration = 1 < durationInSeconds && durationInSeconds < 10 ? 
        durationInSeconds : 2; 
    const clearMessageAfter = defaultDuration + 1; 

    const [messageDisappearing, setMessageToDisappear] = useState(false); 

    useEffect(() => {
        if (message === undefined || message === '') return;

        setMessageToDisappear(false); 

        const setMessageToDisapear = setTimeout(() => {
            setMessageToDisappear(true); 
        }, defaultDuration * 1000);

        const clearMessageTimer = setTimeout(() => {
            setMessage(undefined);  
        }, clearMessageAfter * 1000); 

        return () => {
            clearTimeout(clearMessageTimer); 
            clearTimeout(setMessageToDisapear); 
        } 
    }, [message]); 

    if (!message) return null; 

    return (
        <span className={[styles.activityMessage, className ? className : '', 
            messageDisappearing ? styles.disappear : ''].join(' ')}>
                {message}
        </span>
    ); 
}