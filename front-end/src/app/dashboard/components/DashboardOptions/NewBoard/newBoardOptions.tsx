'use client'

import { panelType } from '@/Types/UIState';
import styles from './newBoardOptions.module.css'; 
import CloseButton from '@/Components/Buttons/closeButton';
import { useState } from 'react';

export default function NewBoardOptions({
    activePanel, 
    setActivePanel,
}: {
    activePanel: panelType
    setActivePanel: (panel: panelType) => void; 
}) {
    // temporary colour array, this needs to ba a argument
    const colours = ['soft-pink', 'light-mint-green', 'aqua', 'lavender-blue', 'light-purple', 'bright-pink' ];

    const [boardName, setBoardName] = useState(''); 


    function handleFormSubmit() {

    }

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <div className={styles.titleAndCloseButton}>
                <header>New Board</header>
                <div className={styles.closeButton}>
                    <CloseButton onClick={() => setActivePanel('none')} />
                </div>
            </div>
            <div className={styles.options}>
                <div className={styles.boardBackgroundColour}>
                    <header>Background Colour</header>
                    <div className={styles.colourGrid}>
                        {colours.map((c) => <div key={c} className={styles[c]}></div>)}
                    </div>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label>Board Name</label>
                        <input type='text' maxLength={50} value={boardName} onChange={e => setBoardName(e.target.value)} />
                    </div>
                    <div>
                        <button type='submit' disabled={boardName === ''}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    ); 
}