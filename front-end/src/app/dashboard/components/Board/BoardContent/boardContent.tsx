
import { DragDropEvents, DragDropManager, DragDropProvider, DragEndEvent, UseDraggableInput } from '@dnd-kit/react';
import {move} from '@dnd-kit/helpers';
import styles from './boardContent.module.css'; 
import { CardId, List, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import BoardList from './BoardList/boardList';
import { DragEventHandler, useRef, useState } from 'react';
import BoardCard from './BoardCard/boardCard';
import {RestrictToWindow, RestrictToElement} from '@dnd-kit/dom/modifiers';
import {RestrictToVerticalAxis, RestrictToHorizontalAxis} from '@dnd-kit/abstract/modifiers';
import BoardContentSkeleton from './BoardContentLoadingSkeleton/boardContentLoadingSkeleton';
import BoardContentLoadingSkeleton from './BoardContentLoadingSkeleton/boardContentLoadingSkeleton';
import AddNewListButton from './AddNewListButton/addNewListButton';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import AddNewCardPanel from './AddNewCardPanel/addNewCardPanel';
import DeleteListDialogBox from './BoardList/DeleteListDialogBox/deleteListDialogBox';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateListOrderRequest } from '@/app/dashboard/Services/listService';
import { ConvertListIdToNumeric } from '@/app/dashboard/Utilities/listUtilities';
import { useUserStore } from '@/Store/userStore';

export default function BoardContent() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const boardDetials = useBoardStore((state) => state.currentBoardData); 
    const listOrder = useBoardStore((state) => state.listOrder); 
    const lastUsedBoardExists = useBoardStore((state) => state.lastUsedBoardExists); 
    const setListOrder = useBoardStore((state) => state.setListOrder);
    const moveCard = useBoardStore((state) => state.moveCard); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const setBoardError = useBoardStore((state) => state.setBoardError); 

    const isCreateNewCardPanelOpen = useBoardUIStore((state) => state.activePanel === 'createNewCardPanel'); 
    const isDeleteListDialogBoxOpen = useBoardUIStore((state) => state.activePanel === 'deleteListDialogBox'); 

    const [currentOpenListMenu, setCurrentOpenListMenu] = useState<ListId | undefined>(undefined); 
    
    // list to which the new card will be added
    const [createNewCardListId, setCreateNewCardListId] = useState<number | undefined>(undefined); 

    const [cardDetailsPanelId, setCardDetailsPanelId] = useState<CardId | undefined>(undefined); 

    const previousListOrder = useRef(listOrder); 

    async function handleListReOrder(boardId: number, newListOrder: ListId[]) {
        let listIDsInOrder: number[] = [];
        for(const listId of newListOrder) {
            listIDsInOrder.push(ConvertListIdToNumeric(listId)); 
        }

        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateListOrderRequest, {
            boardId: boardId, listIDsInOrder: listIDsInOrder
        });

        if (request.ok) {
            setBoardError(''); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
            setListOrder(previousListOrder.current); 
        } else {
            setBoardError(`We couldn't save your new list order. Please try again`); 
            setListOrder(previousListOrder.current); 
        }
    }
    
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
            onDragStart={(event) => {
                previousListOrder.current = listOrder; 
            }}
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
                } else if (source.type === 'boardCard' && target.type === 'cardDropZone') {
                    const sourceParentListId = source.data.parentListId;
                    const targetListId = target.data.listId;

                    const targetList = useBoardStore.getState().lists[targetListId];
                    const targetIndex = targetList.CardIDsAndOrder.length;

                    moveCard(source.id as CardId, sourceParentListId, targetListId, targetIndex );
                }
            }}
            onDragEnd={(event) => {
                const {source, target} = event.operation; 
                if (source === null || target === null) {
                    return;
                }

                if (source.type === 'boardList' && target.type === 'boardList') {
                    const newOrder = move(listOrder, event); 
                    setListOrder(newOrder); 
                    handleListReOrder(boardDetials.id, newOrder); 
                }
            }}
        >
            <div className={[styles.wrapper, styles[boardDetials.boardColour]].join(' ')}>
                {/* <div>{JSON.stringify(listOrder)}</div> */}
                <div className={styles.lists}>
                    {
                        listOrder.map((listId, listIndex) => (
                            <BoardList listId={listId} index={listIndex} key={listId} userRole={boardDetials.role} boardId={boardDetials.id}
                                currentOpenListMenu={currentOpenListMenu} 
                                setCurrentOpenListMenu={setCurrentOpenListMenu}
                                cardDetailsPanelId={cardDetailsPanelId}
                                setCardDetailsPanelId={setCardDetailsPanelId} 
                                setCreateNewCardListId={setCreateNewCardListId}/>
                        ))
                    }
                    <div className={styles.newListButtonContainer}>
                        <AddNewListButton boardId={boardDetials.id} userRole={boardDetials.role} />
                    </div>
                </div>
                { isCreateNewCardPanelOpen && createNewCardListId && 
                    <AddNewCardPanel boardId={boardDetials.id} parentListId={createNewCardListId}/> }
                { isDeleteListDialogBoxOpen && currentOpenListMenu && <DeleteListDialogBox boardId={boardDetials.id} listId={currentOpenListMenu} /> }
            </div>
        </DragDropProvider>
    )
}