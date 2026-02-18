'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './boardNameInput.module.css'; 


export default function BoardNameInput({
    initialName,
}: {
    initialName: string; 
}) {
    const [input, setInput] = useState(initialName); 
    
    function handleInputChange(value: string) {
        setInput(value); 
    }

    function handleOnBlur() {
        if (input === '') {
            setInput(initialName); 
        }
    }

    return (
        <input
            className={styles.wrapper}
            type='text'
            maxLength={50}
            value={input}
            onClick={e => { e.stopPropagation(); }}
            onChange={e => handleInputChange(e.target.value)}
            onBlur={handleOnBlur}/>
    );
}