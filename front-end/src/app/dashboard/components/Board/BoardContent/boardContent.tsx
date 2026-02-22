
import { DragDropProvider } from '@dnd-kit/react';
import styles from './boardContent.module.css'; 
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import BoardList from './BoardList/boardList';

export default function BoardContent() {
    const boardDetials = useBoardStore((state) => state.boardData); 

    const listOrder = useBoardStore((state) => state.listOrder); 
    const setListOrder = useBoardStore((state) => state.setListOrder);
    
    const boardLists = useBoardStore((state) => state.lists); 
    

    if (boardDetials === undefined) {
        // Add styles
        return (
            <div className={styles.wrapper}>
                No data available 
            </div>
        ); 
    }

    return (
        <DragDropProvider>
            <div className={[styles.wrapper, styles[boardDetials.boardColour]].join(' ')}>
                <div className={styles.lists}>
                    {
                        listOrder.map((listId, listIndex) => (
                            <BoardList listId={listId} index={listIndex}>
                                <div>
                                    temp child
                                </div>
                            </BoardList>
                        ))
                    }
                    {
                        listOrder.map((listId, listIndex) => (
                            <BoardList listId={listId} index={listIndex}>
                                <div>
                                    temp child
                                </div>
                            </BoardList>
                        ))
                    }
                    {
                        listOrder.map((listId, listIndex) => (
                            <BoardList listId={listId} index={listIndex}>
                                <div>
                                    temp child
                                </div>
                            </BoardList>
                        ))
                    }
                    <div className={styles.newListButtonContainer}>
                        Add new 
                    </div>
                </div>
            </div>
        </DragDropProvider>
    )
}