'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './boardNameInput.module.css'; 
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateBoardInfoRequest } from '@/app/dashboard/Services/boardService';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';


export default function BoardNameInput({
    initialName,
    boardId, 
}: {
    initialName: string; 
    boardId: number
}) {
    const boardName = initialName; 
    const [input, setInput] = useState(boardName); 
    const setCurrentBoardName = useBoardStore((state) => state.setCurrentBoardName); 
    const resetBoardArray = useBoardStore((state) => state.resetBoardArray); 
    
    function handleInputChange(value: string) {
        setInput(value); 
    }

    async function handleOnBlur() {
        if (input === '') {
            setInput(boardName); 
        } else if (input === initialName) {
            return; 
        }

        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateBoardInfoRequest, 
            { boardId: boardId, boardInfo: {
                name: input.trim(),
                isFavoriteBoard: undefined,
                backgroundColour: undefined
            }}
        ); 

        if (request.ok) {
            setCurrentBoardName(input); 
            resetBoardArray();
        } else {
            setInput(boardName); 
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