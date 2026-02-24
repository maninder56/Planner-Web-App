
import { CardId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import styles from './boardCard.module.css'; 
import { useSortable } from '@dnd-kit/react/sortable';

export default function BoardCard({
    cardId, 
    index,
}: {
    cardId: CardId; 
    index: number;
}) {
    const {ref} = useSortable({
        id: cardId, 
        index, 
        type: 'boardCard', 
        accept: 'boardCard',
        
    }); 

    const cardDetails = useBoardStore((state) => state.cards[cardId]); 


    return (
        <div className={styles.wrapper} ref={ref}>
            <header>{cardDetails.title}</header>
            <p>
                {cardDetails.description}
            </p>
        </div>
    ); 
}