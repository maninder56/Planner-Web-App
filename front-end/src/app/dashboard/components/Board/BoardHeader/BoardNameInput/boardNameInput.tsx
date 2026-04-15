'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './boardNameInput.module.css'; 
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateBoardInfoRequest } from '@/app/dashboard/Services/boardService';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useUserStore } from '@/Store/userStore';
import { UserRole } from '@/app/dashboard/Types/boardTypes';


export default function BoardNameInput({
    initialName,
    boardId, 
    userRole, 
}: {
    initialName: string; 
    boardId: number; 
    userRole: UserRole; 
}) {
    const boardName = initialName; 
    const [input, setInput] = useState(boardName); 

    const setCurrentBoardName = useBoardStore((state) => state.setCurrentBoardName); 
    const resetBoardArray = useBoardStore((state) => state.resetBoardArray); 
    const setBoardError = useBoardStore((state) => state.setBoardError); 

    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const inputRef = useRef<HTMLInputElement | null>(null); 

    const disableInput = userRole === 'Viewer'; 

    async function handleNameChange() {
        const inputTrimmed = input.trim(); 
        if (inputTrimmed === '') {
            setInput(boardName); 
            return; 
        } else if (inputTrimmed === initialName) {
            return; 
        }

        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateBoardInfoRequest, 
            { boardId: boardId, boardInfo: {
                name: inputTrimmed,
                isFavoriteBoard: undefined,
                backgroundColour: undefined
            }}
        ); 

        if (request.ok) {
            setCurrentBoardName(inputTrimmed);
            setInput(inputTrimmed); 
            resetBoardArray();
            setBoardError(''); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
            setInput(boardName); 
        } else {
            setBoardError('Failed to change board name, please try again.'); 
            setInput(boardName); 
        }
    }

    async function handleEnterKeyAfterNameChange(key: string) {
        if (key === 'Enter') {
            inputRef.current?.blur(); 
            await handleNameChange(); 
        }
    }


    return (
        <input
            ref={inputRef}
            className={styles.wrapper}
            type='text'
            maxLength={50}
            value={input}
            disabled={disableInput}
            onClick={e => { e.stopPropagation(); }}
            onChange={e => setInput(e.target.value)}
            onBlur={handleNameChange}
            onKeyDown={e => handleEnterKeyAfterNameChange(e.key)}/>
    );
}