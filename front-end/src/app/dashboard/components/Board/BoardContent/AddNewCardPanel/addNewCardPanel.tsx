
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './addNewCardPanel.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { FormEvent, useEffect, useState } from 'react';
import { CardPriority } from '@/app/dashboard/Types/boardTypes';
import Button from '@/Components/Buttons/button';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { CreateNewCardRequest } from '@/app/dashboard/Services/cardService';
import { useUserStore } from '@/Store/userStore';

export default function AddNewCardPanel({
    boardId, 
    parentListId, 

}: {
    boardId: number;
    parentListId: number;  
}) {
    const getLocalDate = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [title, setTitle] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [isDone, setIsDone] = useState(false); 
    const [dueDate, setDueDate] = useState(getLocalDate()); 
    const [priority, setPriority] = useState<CardPriority>('Low'); 

    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const [submitError, setSubmitError] = useState(''); 
    const [titleError, setTitleError] = useState(''); 


    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault(); 
        setButtonDisabled(true); 

        try {
            const request = await ApiRequestWithRefreshTokenAttemptAndData(CreateNewCardRequest, {
                boardId: boardId, listId: parentListId, newCard: {
                    Title: title,
                    Description: description, 
                    IsDone: isDone,
                    DueDate: dueDate,
                    Priority: priority,
                }
            }); 

            if (request.ok && request.data !== undefined) {
                // add new card to list
                setSubmitError(''); 
                setTitleError(''); 
                setActivePanel('none'); 
            } else if (!request.ok && request.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else {
                setSubmitError('Failed to create new Card, please try again.');
            }
        } finally {
            setButtonDisabled(false); 
        }
    }

    function handlePriorityChange(value: string) {
        if (value === 'Low' || value === 'Medium' || value === 'High') {
            setPriority(value); 
        }
    }

    function handleTitleChange(value: string) {
        if (value.trim() === '') {
            setTitleError('Title is required'); 
        } else {
            setTitleError(''); 
        }

        setTitle(value); 
    }

    return (
        <BigHoverPanel title='Add New Card' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                <form className={styles.cardForm} onSubmit={handleFormSubmit}>
                    <div className={styles.error}>{submitError}</div>
                    <div className={styles.checkboxAndTitle}>
                        <input className={styles.checkbox} type='checkbox' name='isDone' checked={isDone} onChange={e => setIsDone(e.target.checked)} />
                        <input className={[styles.title, (isDone && title.trim() !== '') ? styles.crossTheTask : '', ].join(' ')} 
                            type='text' name='title' placeholder='Title...' maxLength={50} value={title} autoFocus={true} 
                            onChange={e => handleTitleChange(e.target.value)} />
                    </div>
                    <span className={styles.titleError}>{titleError}</span>
                    <div className={styles.priorityAndDueDateContainer}>
                        <div>
                            <header>Priority</header>
                            <select name='priority' value={priority} onChange={e => handlePriorityChange(e.target.value)}>
                                <option value={'Low'}>Low</option>
                                <option value={'Medium'}>Medium</option>
                                <option value={'High'}>High</option>
                            </select>
                        </div>
                        <div>
                            <header>Due Date</header>
                            <input type='date' name='dueDate' value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.description}>
                        <header>Description</header>
                        <textarea name='description' maxLength={400} value={description} placeholder='card details...'
                            onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className={styles.buttonsContainer}>
                        <button type='submit' className='button blue' disabled={buttonDisabled || title.trim() === ''}>Save</button>
                    </div>
                </form>
            </div>
        </BigHoverPanel>
    ); 
}