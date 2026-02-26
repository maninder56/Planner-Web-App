
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './boardCardDetails.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { CardId, useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function BoardCardDetails({
    cardId
}: {
    cardId: CardId; 
}) {
    const cardDetails = useBoardStore((state) => state.cards[cardId]); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <BigHoverPanel title='Card Details' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                <div>
                    {JSON.stringify(cardDetails)}
                </div>
            </div>
        </BigHoverPanel>
    ); 
}