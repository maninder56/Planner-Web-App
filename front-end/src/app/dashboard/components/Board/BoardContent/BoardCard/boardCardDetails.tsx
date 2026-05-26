
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
import Button from '@/Components/Buttons/button';
import DeleteCardDialogBox from './DeleteCardDialogBox/DeleteCardDialogBox';

export default function BoardCardDetails({
    boardId, 
    cardId, 
    parentListId, 
    viewOnlyBoard, 
}: {
    boardId: number;
    cardId: CardId; 
    parentListId: ListId; 
    viewOnlyBoard: boolean; 
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
    const [showDeleteCardDialogBox, setShowDeleteCardDialogBox] = useState(false); 

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
            } else if (request.error === 'Forbidden') {
                setSubmitError('You are not authorized to modify this board. Please request the necessary permissions.');    
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
        if (buttonDisabled || viewOnlyBoard) {
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
                {
                    !cardDetails ? 
                    <div className={styles.cardNotFound}>Failed to load card.</div>
                    : 
                    <>
                    <form className={styles.cardForm} onSubmit={handleFormSubmit}>
                        {
                            viewOnlyBoard &&
                            <div className={styles.viewOnlyBoard}>
                                <svg width="50" height="50" viewBox="0 0 1.5 1.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m0.205 0.139 1.156 1.156a0.047 0.047 0 1 1 -0.066 0.066L0.875 0.941 0.566 1.25a0.141 0.141 0 0 1 -0.062 0.036l-0.32 0.087a0.047 0.047 0 0 1 -0.058 -0.058l0.087 -0.32a0.141 0.141 0 0 1 0.036 -0.062L0.559 0.625 0.139 0.205a0.047 0.047 0 1 1 0.066 -0.066M0.625 0.691 0.316 1a0.05 0.05 0 0 0 -0.01 0.015l-0.002 0.006 -0.066 0.241 0.241 -0.066a0.05 0.05 0 0 0 0.016 -0.008L0.5 1.184 0.809 0.875zm0.373 -0.506a0.224 0.224 0 0 1 0.325 0.307l-0.009 0.01 -0.307 0.307 -0.066 -0.066L1.121 0.563 0.938 0.379l-0.18 0.18 -0.066 -0.066zm0.066 0.066 -0.061 0.061L1.188 0.496l0.061 -0.061a0.13 0.13 0 0 0 -0.184 -0.184" 
                                        fill="#212121"/>
                                </svg>
                                <span>View only</span>
                            </div>
                        }
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
                                <input className={styles.dueDateInput} type='date' name='dueDate' 
                                    min={'2000-01-01'} max={'2100-12-01'} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                            </div>
                        </div>
                        <div className={styles.description}>
                            <header>Description</header>
                            <textarea name='description' maxLength={400} value={description} placeholder='card details...'
                                onChange={e => setDescription(e.target.value)} />
                        </div>
                        {
                            !viewOnlyBoard && 
                            <>
                            <div className={styles.buttonsContainer}>
                                <button type='submit' className='button blue' disabled={disableSaveButton()}>Save</button>
                            </div>
                            <div className={styles.deleteButton}>
                                <Button name='Delete Card' color='red' disabled={buttonDisabled || viewOnlyBoard } 
                                    onClick={() => setShowDeleteCardDialogBox(true)} />
                            </div>
                            </>
                        }
                    </form>
                    {showDeleteCardDialogBox && <DeleteCardDialogBox boardId={boardId} listId={parentListIdAsNumber} 
                        cardId={cardDetails.id} cardTitle={cardDetails.name} onCancel={() => setShowDeleteCardDialogBox(false)}/> }
                    </>
                }
            </div>
        </BigHoverPanel>
    ); 
}