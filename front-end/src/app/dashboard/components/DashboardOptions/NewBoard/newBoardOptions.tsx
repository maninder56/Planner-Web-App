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

export default function NewBoardOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const colours: BoardColour[] = BoardColoursList; 

    const [boardColour, setBoardColour] = useState(colours[0]); 
    const [boardName, setBoardName] = useState(''); 
    const [buttonsDisabled, setButtonsDisabled] = useState(true); 

    function handleFormSubmit(e: FormEvent) {
        e.stopPropagation(); 
        e.preventDefault(); 

        

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
                    <div className={styles.formButton}>
                        <button type='submit' disabled={buttonsDisabled}>Create</button>
                    </div>
                </form>
        </HoverOptionsPanel>
    ); 
}