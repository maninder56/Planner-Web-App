
import { CardId, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import styles from './boardCard.module.css'; 
import { useSortable } from '@dnd-kit/react/sortable';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useState } from 'react';
import BoardCardDetails from './boardCardDetails';

export default function BoardCard({
    cardId, 
    index,
    parentListId, 
    cardDetailsPanelId, 
    setCardDetailsPanelId, 
}: {
    cardId: CardId; 
    index: number;
    parentListId: ListId; 
    cardDetailsPanelId?: CardId; 
    setCardDetailsPanelId: (cardId?: CardId) => void; 
}) {
    const {ref} = useSortable({
        id: cardId, 
        index, 
        type: 'boardCard', 
        accept: 'boardCard',
        group: parentListId, 
        data: {
            parentListId,
            index,
        }
    }); 

    const cardDetails = useBoardStore((state) => state.cards[cardId]);
    const isCardDetailsPanelOpen = useBoardUIStore((state) => state.activePanel === 'cardDetailsPanel'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const setDoneOnCard = useBoardStore((state) => state.setDoneOnCard); 

    return (
        <div className={styles.wrapper} ref={ref} 
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('cardDetailsPanel');
                setCardDetailsPanelId(cardId); 
            }}
        >
            <header>
                <input type='checkbox' defaultChecked={cardDetails.done} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        setDoneOnCard(cardId, !cardDetails.done)}} />
                <h3 className={cardDetails.done ? styles.taskDone : undefined }>{cardDetails.name}</h3>
            </header>
            <div className={styles.cardContent}>
                <p>{cardDetails.description}</p>
                <div className={styles.priorityAndDueDate}>
                    <div>
                        <span>Priority</span>
                        <div>{cardDetails.priority} </div>
                    </div>
                    <div>
                        <span>Due Date</span>
                        <div>{cardDetails.dueDate.toLocaleDateString('en-GB')}</div>
                    </div>
                </div>
            </div>
            {
                isCardDetailsPanelOpen && cardDetailsPanelId === cardId ? 
                    <BoardCardDetails cardId={cardId} />
                : null
            }
        </div>
    ); 
}