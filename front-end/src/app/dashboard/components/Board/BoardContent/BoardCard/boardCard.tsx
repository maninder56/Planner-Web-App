
import { CardId, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import styles from './boardCard.module.css'; 
import { useSortable } from '@dnd-kit/react/sortable';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useState } from 'react';
import BoardCardDetails from './boardCardDetails';
import { UserRole } from '@/app/dashboard/Types/boardTypes';

export default function BoardCard({
    cardId, 
    index,
    userRole, 
    parentListId, 
    cardDetailsPanelId, 
    setCardDetailsPanelId, 
}: {
    cardId: CardId; 
    index: number;
    userRole: UserRole; 
    parentListId: ListId; 
    cardDetailsPanelId?: CardId; 
    setCardDetailsPanelId: (cardId?: CardId) => void; 
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

    const cardDetails = useBoardStore((state) => state.cards[cardId]);
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
                <div ref={handleRef} className={styles.grabCardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6h.01M15 6h.01M15 12h.01M9 12h.01M9 18h.01M15 18h.01M10 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" 
                            stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
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
                        {/* <div>{cardDetails.dueDate.toLocaleDateString('en-GB')}</div> */}
                        <div>{cardDetails.dueDate.toString()}</div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}