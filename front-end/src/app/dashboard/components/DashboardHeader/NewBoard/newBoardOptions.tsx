'use client'

import {  panelType } from '@/app/dashboard/Types/UIState';
import styles from './newBoardOptions.module.css'; 
import CloseButton from '@/Components/Buttons/closeButton';
import { FormEvent, useActionState, useState } from 'react';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import { BoardColour } from '@/app/dashboard/Types/boardTypes';
import { BoardColoursList } from '@/app/dashboard/Utilities/boardColours';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { CreateNewBoardRequest, UpdateLastUsedBoardRequest } from '@/app/dashboard/Services/boardService';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { NormaliseBoardData } from '@/app/dashboard/Utilities/boardData';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';

export default function NewBoardOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const setLastUsedBoardExists = useBoardStore((state) => state.setLastUsedBoardExists); 
    const resetBoardData = useBoardStore((state) => state.resetBoardData); 
    const addNewBoard = useBoardStore((state) => state.AddNewBoardToBoardArray); 

    const colours: BoardColour[] = BoardColoursList; 

    const [boardColour, setBoardColour] = useState(colours[0]); 
    const [boardName, setBoardName] = useState(''); 
    const [buttonsDisabled, setButtonsDisabled] = useState(true); 
    const [errorMessage, setErrorMessage] = useState(''); 

    async function handleFormSubmit(e: FormEvent) {
        e.stopPropagation(); 
        e.preventDefault(); 

        setButtonsDisabled(true); 

        try {
            const result = await ApiRequestWithRefreshTokenAttemptAndData(CreateNewBoardRequest, 
                { name:boardName.trim(), colour:boardColour } ); 
            if (result.ok) {
                if (result.data !== undefined) {
                    hydrateBoard(NormaliseBoardData(result.data)); 
                    setLastUsedBoard(result.data.boardId); 
                    addNewBoard(result.data); 
                }
                else {
                    resetBoardData(); 
                }
                
                setActivePanel('none'); 
            } else {
                setErrorMessage('Something Went wrong, Please try again.'); 
            }
        } finally {
            setButtonsDisabled(false); 
        }
    }

    async function setLastUsedBoard(boardId: number) {
        const lastUsedBoardResult =  await ApiRequestWithRefreshTokenAttemptAndData(
            UpdateLastUsedBoardRequest, boardId); 

        if (lastUsedBoardResult.ok) {
            setLastUsedBoardExists(true); 
        } 
    }

    function handleBoardNameChange(newValue: string) {
        if (newValue === '') {
            setButtonsDisabled(true); 
        } else {
            setButtonsDisabled(false); 
        }

        setBoardName(newValue); 
    }

    return (
        <HoverOptionsPanel title='New Board' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.boardBackgroundColour}>
                    <header>Background Colour</header>
                    <div className={styles.colourGrid}>
                        {colours.map((c) => {
                            const selectedBoard = c === boardColour ? styles.selectedBoardColour : null; 
                            return <div key={c} className={[styles[c], selectedBoard].join(' ')} 
                                    onClick={e => { 
                                        e.stopPropagation(); 
                                        setBoardColour(c)
                                    }}></div>
                        })}
                    </div>
                </div>
                <form onSubmit={handleFormSubmit} className={styles.boardNameForm}>
                    <div>
                        <label>Board Name</label>
                        <input type='text' maxLength={50} value={boardName} onChange={e => handleBoardNameChange(e.target.value)} />
                    </div>
                    <div className={styles.errorMessage}>
                        <p>{errorMessage}</p>
                    </div>
                    <div className={styles.formButton}>
                        <button type='submit' disabled={buttonsDisabled}>Create</button>
                    </div>
                </form>
        </HoverOptionsPanel>
    ); 
}