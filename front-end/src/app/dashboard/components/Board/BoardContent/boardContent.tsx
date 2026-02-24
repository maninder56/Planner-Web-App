
import { DragDropEvents, DragDropManager, DragDropProvider, DragEndEvent, UseDraggableInput } from '@dnd-kit/react';
import {move} from '@dnd-kit/helpers';
import styles from './boardContent.module.css'; 
import { List, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import BoardList from './BoardList/boardList';
import { DragEventHandler, useState } from 'react';
import BoardCard from './BoardCard/boardCard';
import {RestrictToWindow, RestrictToElement} from '@dnd-kit/dom/modifiers';
import {RestrictToVerticalAxis, RestrictToHorizontalAxis} from '@dnd-kit/abstract/modifiers';

export default function BoardContent() {
    const boardDetials = useBoardStore((state) => state.boardData); 
    const listOrder = useBoardStore((state) => state.listOrder); 
    const setListOrder = useBoardStore((state) => state.setListOrder);
    const moveCard = useBoardStore((state) => state.moveCard); 

    const [currentOpenListMenu, setCurrentOpenListMenu] = useState<ListId | undefined>(undefined); 
    
    if (boardDetials === undefined) {
        // Add styles
        return (
            <div className={styles.wrapper}>
                No data available 
            </div>
        ); 
    }


    return (
        <DragDropProvider
            modifiers={(defaults) => [...defaults]}
            onDragOver={(event) => {
                const {source, target} = event.operation; 
                if (source === null || target === null) {
                    return;
                }

                if (source.type === 'boardCard' && target.type === 'boardCard') {
                    // moveCard(source.id, )
                    console.log(source); 
                } else if (source.type === 'boardList' && target.type === 'boardList') {
                    const newOrder = move(listOrder, event); 
                    setListOrder(newOrder);    
                }
            }}
            // onDragEnd={(event) => {
            //     const {source, target} = event.operation; 
            //     if (source === null || target === null) {
            //         return;
            //     }

            //     if (source.type === 'boardList') {
            //         const newOrder = move(listOrder, event); 
            //         setListOrder(newOrder); 
            //     }
            // }}
        >
            <div className={[styles.wrapper, styles[boardDetials.boardColour]].join(' ')}>
                <div className={styles.lists}>
                    {
                        listOrder.map((listId, listIndex) => (
                            <BoardList listId={listId} index={listIndex} key={listId} 
                                currentOpenListMenu={currentOpenListMenu} 
                                setCurrentOpenListMenu={setCurrentOpenListMenu} />
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