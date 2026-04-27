
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './boardCardDetails.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { CardId, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import { FormEvent, useState } from 'react';
import { CardPriority } from '@/app/dashboard/Types/boardTypes';
import { useUserStore } from '@/Store/userStore';
import { ConvertListIdToNumeric } from '@/app/dashboard/Utilities/listUtilities';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateCardInfoRequest } from '@/app/dashboard/Services/cardService';

export default function BoardCardDetails({
    boardId, 
    cardId, 
    parentListId, 
}: {
    boardId: number;
    cardId: CardId; 
    parentListId: ListId; 
}) {
    const getLocalDate = (date: string) => {
        let d = new Date(date);
        if (Number.isNaN(d.getTime())) {
            d = new Date(); 
        }

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const updateCardInfo = useBoardStore((state) => state.updateCardInfo); 

    const cardDetails = useBoardStore((state) => state.cards[cardId]); 

    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const parentListIdAsNumber = ConvertListIdToNumeric(parentListId); 
    
    const [title, setTitle] = useState(cardDetails.name); 
    const [description, setDescription] = useState(cardDetails.description); 
    const [isDone, setIsDone] = useState(cardDetails.done); 
    const [dueDate, setDueDate] = useState(getLocalDate(cardDetails.dueDate)); 
    const [priority, setPriority] = useState<CardPriority>(cardDetails.priority); 

    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const [submitError, setSubmitError] = useState(''); 
    const [titleError, setTitleError] = useState(''); 

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault();
        setButtonDisabled(true); 

        if (parentListIdAsNumber === -1) {
            setSubmitError('Failed to update card, please try again.'); 
            return; 
        }

        if (!validateFormValues()) {
            return; 
        }

        try {
            const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateCardInfoRequest, {
                boardId: boardId,
                listId: parentListIdAsNumber,
                cardId: cardDetails.id,
                card: {
                    Title: title.trim(),
                    Description: description.trim(),
                    IsDone: isDone,
                    DueDate: dueDate,
                    Priority: priority
                }
            }); 

            if (request.ok) {
                updateCardInfo(cardId, {
                    Title: title.trim(),
                    Description: description.trim(),
                    IsDone: isDone,
                    DueDate: dueDate,
                    Priority: priority
                }); 
                setSubmitError(''); 
                setActivePanel('none'); 
            } else if (request.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else {
                setSubmitError('Failed to update card, please try again.');    
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

    function validateFormValues() {
        const titleTrimmed = title.trim(); 

        if (titleTrimmed === '') {
            return false; 
        }

        const descriptionTrimmed = description.trim(); 

        if (titleTrimmed === cardDetails.name && descriptionTrimmed === cardDetails.description && 
            isDone === cardDetails.done && priority === cardDetails.priority && 
            dueDate === getLocalDate(cardDetails.dueDate)
        ) {
            return false; 
        }

        return true; 
    }

    function disableSaveButton() {
        if (buttonDisabled) {
            return true; 
        } 

        if (validateFormValues()) {
            return false; 
        } else {
            return true; 
        }
    }


    return (
        <BigHoverPanel title='Card Details' onCloseClick={() => setActivePanel('none')}>
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
                        <button type='submit' className='button blue' disabled={disableSaveButton()}>Save</button>
                    </div>
                </form>
            </div>
        </BigHoverPanel>
    ); 
}