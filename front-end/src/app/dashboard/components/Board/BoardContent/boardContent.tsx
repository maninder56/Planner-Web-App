
import { DragDropEvents, DragDropManager, DragDropProvider, DragEndEvent, UseDraggableInput } from '@dnd-kit/react';
import {move} from '@dnd-kit/helpers';
import styles from './boardContent.module.css'; 
import { CardId, List, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import BoardList from './BoardList/boardList';
import { DragEventHandler, useState } from 'react';
import BoardCard from './BoardCard/boardCard';
import {RestrictToWindow, RestrictToElement} from '@dnd-kit/dom/modifiers';
import {RestrictToVerticalAxis, RestrictToHorizontalAxis} from '@dnd-kit/abstract/modifiers';
import BoardContentSkeleton from './BoardContentLoadingSkeleton/boardContentLoadingSkeleton';
import BoardContentLoadingSkeleton from './BoardContentLoadingSkeleton/boardContentLoadingSkeleton';

export default function BoardContent() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const boardDetials = useBoardStore((state) => state.currentBoardData); 
    const listOrder = useBoardStore((state) => state.listOrder); 
    const lastUsedBoardExists = useBoardStore((state) => state.lastUsedBoardExists); 
    const setListOrder = useBoardStore((state) => state.setListOrder);
    const moveCard = useBoardStore((state) => state.moveCard); 

    const [currentOpenListMenu, setCurrentOpenListMenu] = useState<ListId | undefined>(undefined); 
    const [cardDetailsPanelId, setCardDetailsPanelId] = useState<CardId | undefined>(undefined); 
    
    if (isBoardLoading) {
        return <BoardContentLoadingSkeleton />
    } else if (lastUsedBoardExists !== undefined && !lastUsedBoardExists) {
        return (
            <div className={[styles.wrapper, styles.noBoardSelected].join(' ')}>
                <header>No board selected</header>
                <p>Please select a board or create new one.</p>
            </div>
        ); 
    } else if (boardDetials === undefined) {
        return (
            <div className={[styles.wrapper, styles.noBoardSelected].join(' ')}>
                <header>Failed to load board data</header>
                <p>Please select a board to try again.</p>
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
                    const sourceParentListId = source.data.parentListId; 
                    const targetParentListId = target.data.parentListId; 
                    const targetIndex = target.data.index; 
                    moveCard(source.id as CardId, sourceParentListId, targetParentListId, targetIndex); 
                } else if (source.type === 'boardList' && target.type === 'boardList') {
                    const newOrder = move(listOrder, event); 
                    setListOrder(newOrder);    
                } else if (source.type === 'boardCard' && target.type === 'cardDropZone') {
                    const sourceParentListId = source.data.parentListId;
                    const targetListId = target.data.listId;

                    const targetList = useBoardStore.getState().lists[targetListId];
                    const targetIndex = targetList.CardIDsAndOrder.length;

                    moveCard(source.id as CardId, sourceParentListId, targetListId, targetIndex );
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
                {/* <div>{JSON.stringify(listOrder)}</div> */}
                <div className={styles.lists}>
                    {
                        listOrder.map((listId, listIndex) => (
                            <BoardList listId={listId} index={listIndex} key={listId} 
                                currentOpenListMenu={currentOpenListMenu} 
                                setCurrentOpenListMenu={setCurrentOpenListMenu}
                                cardDetailsPanelId={cardDetailsPanelId}
                                setCardDetailsPanelId={setCardDetailsPanelId} />
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