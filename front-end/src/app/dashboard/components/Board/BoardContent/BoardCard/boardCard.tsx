
import { CardId, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import styles from './boardCard.module.css'; 
import {CollisionPriority} from '@dnd-kit/abstract';
import {RestrictToElement, RestrictToWindow} from '@dnd-kit/dom/modifiers';
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
import {
  closestCenter,
  pointerIntersection,
  directionBiased
} from '@dnd-kit/collision';
import { DragOverlay } from '@dnd-kit/react';
import DisappearingMessage from '@/Components/Alert/DisappearingMessage/disappearingMessage';

export default function BoardCard({
    cardId, 
    index,
    userRole, 
    parentListId, 
}: {
    cardId: CardId; 
    index: number;
    userRole: UserRole; 
    parentListId: ListId; 
}) {
    const viewOnly = userRole === 'Viewer'; 

    const boardId = useBoardStore((state) => state.currentBoardData?.id); 
    const parentListIdAsNumber = ConvertListIdToNumeric(parentListId); 
    const cardDetails = useBoardStore((state) => state.cards[cardId]);
    
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setBoardError = useBoardStore((state) => state.setBoardError); 
    const setDoneOnCard = useBoardStore((state) => state.setDoneOnCard); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const setCardDetailsPanelData = useBoardUIStore((state) => state.setCardDetailsPanelData); 

    const activityMessage = useBoardStore((state) => state.cards[cardId].activityMessage); 
    const setCardActivityMessage = useBoardStore((state) => state.setCardActivityMessage); 

    const [IsCardDone, setIsCardDone] = useState(cardDetails.done); 

    const isCardHidden = useBoardUIStore((state) => state.hiddenCardsAndLists.hiddenCards.has(cardId)); 

    const dueDate = new Date(cardDetails.dueDate); 
    const dueDateFormated = Number.isNaN(dueDate.getTime()) ? '-' : dateFormatter.format(dueDate); 

    const cardDescription = cardDetails.description.length > 100 ?  
        `${cardDetails.description.slice(0, 100)}...` : 
        cardDetails.description; 
    const bigCard = cardDescription.length > 10; 

    const {ref, handleRef, isDragging} = useSortable({
        id: cardId, 
        index, 
        type: 'boardCard', 
        accept: 'boardCard',
        collisionPriority: CollisionPriority.Normal,
        collisionDetector: closestCenter, 
        // modifiers: [RestrictToWindow], 
        group: parentListId, 
        data: {
            parentListId,
            index,
        }, 
        disabled: viewOnly, 
        transition: {
            duration: 0, 
            idle: false,
        }
    }); 

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

    if (isCardHidden) {
        return (
            <div className={[styles.wrapper, styles.hidden].join(' ')} ref={ref}>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"/>
                </svg>
            </div>
        ); 
    }


    function handleCardActivityMessage(message?: string) {
        setCardActivityMessage(cardId, message); 
    }

    return (
        <div className={[styles.wrapper, 
            IsCardDone ? styles.taskDone : '', 
            isDragging ? styles.isDragging : '', 
            bigCard ? styles.bigCard : ''].join(' ')} ref={ref} 
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('cardDetailsPanel');
                setCardDetailsPanelData({parentListId: parentListId, cardId: cardId}); 
            }}
        >
            <div className={styles.disappearingMessage}>
                <DisappearingMessage message={activityMessage} durationInSeconds={2} setMessage={handleCardActivityMessage} />
            </div>
            <header>
                <input type='checkbox' disabled={viewOnly} className={styles.checkbox} defaultChecked={IsCardDone} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        handleDoneOnCard(cardId, !IsCardDone)}} />
                <h3 className={[styles.cardName, IsCardDone ? styles.taskDone : ''].join(' ')}>{cardDetails.name}</h3>
                <div ref={handleRef} className={[styles.grabCardIcon, viewOnly ? styles.disabled : ''].join(' ')}>
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