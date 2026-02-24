
import { DragDropEvents, DragDropManager, DragDropProvider, DragEndEvent, UseDraggableInput } from '@dnd-kit/react';
import {move} from '@dnd-kit/helpers';
import styles from './boardContent.module.css'; 
import { List, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import BoardList from './BoardList/boardList';
import { DragEventHandler, useState } from 'react';
import BoardCard from './BoardCard/boardCard';

export default function BoardContent() {
    const boardDetials = useBoardStore((state) => state.boardData); 

    if (boardDetials === undefined) {
        // Add styles
        return (
            <div className={styles.wrapper}>
                No data available 
            </div>
        ); 
    }



    const listOrder = useBoardStore((state) => state.listOrder); 
    const setListOrder = useBoardStore((state) => state.setListOrder);

    const boardList = useBoardStore((state) => state.lists); 

    const [currentOpenListMenu, setCurrentOpenListMenu] = useState<ListId | undefined>(undefined); 
    


    return (
        <DragDropProvider
            onDragEnd={(event) => {
                const {source, target} = event.operation; 
                if (source === null || target === null) {
                    return;
                }
            }}
        >
            <div className={[styles.wrapper, styles[boardDetials.boardColour]].join(' ')}>
                <div className={styles.lists}>
                    {
                        listOrder.map((listId, listIndex) => (
                            <BoardList listId={listId} index={listIndex} key={listId} 
                                currentOpenListMenu={currentOpenListMenu} setCurrentOpenListMenu={setCurrentOpenListMenu}>
                                {
                                    boardList[listId].CardIDsAndOrder.map((cardId, index) => (
                                        <BoardCard cardId={cardId} index={index} key={cardId}/>
                                    ))
                                }
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