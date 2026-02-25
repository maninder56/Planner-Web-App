
import { CardId, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import styles from './boardCard.module.css'; 
import { useSortable } from '@dnd-kit/react/sortable';

export default function BoardCard({
    cardId, 
    index,
    parentListId, 
}: {
    cardId: CardId; 
    index: number;
    parentListId: ListId
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

    return (
        <div className={styles.wrapper} ref={ref}>
            <header>
                <input type='checkbox' checked={cardDetails.done} />
                <h3 className={cardDetails.done ? styles.taskDone : undefined }>{cardDetails.title}</h3>
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
        </div>
    ); 
}