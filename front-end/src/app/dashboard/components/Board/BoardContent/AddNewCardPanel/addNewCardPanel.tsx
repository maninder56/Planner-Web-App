
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './addNewCardPanel.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';

export default function AddNewCardPanel({
    boardId, 
    parentListId
}: {
    boardId: number;
    parentListId: number;  
}) {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <BigHoverPanel title='Add New Card' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
            </div>
        </BigHoverPanel>
    ); 
}