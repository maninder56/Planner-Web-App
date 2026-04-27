
import { CardId, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import styles from './boardCard.module.css'; 
import { useSortable } from '@dnd-kit/react/sortable';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useState } from 'react';
import BoardCardDetails from './boardCardDetails';
import { UserRole } from '@/app/dashboard/Types/boardTypes';
import { dateFormatter } from '@/app/dashboard/Utilities/boardData';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateCardInfoRequest } from '@/app/dashboard/Services/cardService';
import { ConvertListIdToNumeric } from '@/app/dashboard/Utilities/listUtilities';
import { useUserStore } from '@/Store/userStore';

export default function BoardCard({
    cardId, 
    index,
    userRole, 
    parentListId, 
    setCardDetailsPanelData,
}: {
    cardId: CardId; 
    index: number;
    userRole: UserRole; 
    parentListId: ListId; 
    setCardDetailsPanelData: (data: {parentListId: ListId, cardId: CardId} | undefined) => void; 
}) {
    const viewOnly = userRole === 'Viewer'; 

    const {ref, handleRef} = useSortable({
        id: cardId, 
        index, 
        type: 'boardCard', 
        accept: 'boardCard',
        group: parentListId, 
        data: {
            parentListId,
            index,
        }, 
        disabled: viewOnly, 
    }); 

    const boardId = useBoardStore((state) => state.currentBoardData?.id); 
    const parentListIdAsNumber = ConvertListIdToNumeric(parentListId); 
    const cardDetails = useBoardStore((state) => state.cards[cardId]);
    
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setBoardError = useBoardStore((state) => state.setBoardError); 
    const setDoneOnCard = useBoardStore((state) => state.setDoneOnCard); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [IsCardDone, setIsCardDone] = useState(cardDetails.done); 

    const dueDate = new Date(cardDetails.dueDate); 
    const dueDateFormated = Number.isNaN(dueDate.getTime()) ? '-' : dateFormatter.format(dueDate); 

    const cardDescription = cardDetails.description.length > 100 ?  
        `${cardDetails.description.slice(0, 100)}...` : 
        cardDetails.description; 

    async function handleDoneOnCard(cardId: CardId, isDone: boolean) {
        if (boardId === undefined || parentListIdAsNumber === -1) {
            setBoardError('Failed to update card, please try again.'); 
            return; 
        }

        setIsCardDone(isDone); 

        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateCardInfoRequest, {
            boardId: boardId, listId: parentListIdAsNumber, cardId: cardDetails.id, card: {
                IsDone: isDone,
            }
        }); 

        if (request.ok) {
            setDoneOnCard(cardId, isDone); 
            setBoardError(''); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
            setIsCardDone(!isDone); 
        } else {
            setBoardError('Failed to update card, please try again.'); 
            setIsCardDone(!isDone); 
        }
    }

    return (
        <div className={[styles.wrapper, IsCardDone ? styles.taskDone: ''].join(' ')} ref={ref} 
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('cardDetailsPanel');
                setCardDetailsPanelData({parentListId: parentListId, cardId: cardId}); 
            }}
        >
            <header>
                <input type='checkbox' className={styles.checkbox} defaultChecked={IsCardDone} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        handleDoneOnCard(cardId, !IsCardDone)}} />
                <h3 className={[styles.cardName, IsCardDone ? styles.taskDone : ''].join(' ')}>{cardDetails.name}</h3>
                <div ref={handleRef} className={styles.grabCardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6h.01M15 6h.01M15 12h.01M9 12h.01M9 18h.01M15 18h.01M10 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" 
                            stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </header>
            <div className={styles.cardContent}>
                <p className={styles.description}>{cardDescription}</p>
                <div className={styles.priorityAndDueDate}>
                    <div>
                        <span>Priority</span>
                        <div className={`${styles.priority} ${styles[cardDetails.priority.toLowerCase()]}`}>{cardDetails.priority}</div>
                    </div>
                    <div>
                        <span>Due Date</span>
                        <div>{dueDateFormated}</div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}