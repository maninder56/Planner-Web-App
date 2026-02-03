'use client'

import {  panelType } from '@/Types/UIState';
import styles from './newBoardOptions.module.css'; 
import CloseButton from '@/Components/Buttons/closeButton';
import { FormEvent, useActionState, useState } from 'react';
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';

export default function NewBoardOptions() {
    const [activePanel, setActivePanel] = useActivePanel(); 

    // temporary colour array, this needs to ba a argument
    const colours = ['soft-pink', 'light-mint-green', 'aqua', 'lavender-blue', 'light-purple', 'bright-pink' ];

    const [boardColour, setBoardColour] = useState(colours[0]); 
    const [boardName, setBoardName] = useState(''); 

    function handleFormSubmit(e: FormEvent) {
        e.stopPropagation(); 
        e.preventDefault(); 
    }

    return (
        <div className={styles.wrapper}>
            <HoverOptionsPanel title='New Board' onCloseClick={() => setActivePanel('none')}>
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
                            <input type='text' maxLength={50} value={boardName} onChange={e => setBoardName(e.target.value)} />
                        </div>
                        <div className={styles.formButton}>
                            <button type='submit' disabled={boardName === ''}>Create</button>
                        </div>
                    </form>
            </HoverOptionsPanel>
        </div>
    ); 
}