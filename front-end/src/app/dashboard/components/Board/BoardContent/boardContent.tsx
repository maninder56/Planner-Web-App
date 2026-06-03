
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
import BoardCardDetails from './BoardCard/boardCardDetails';
import { UpdateCardOrderRequest } from '@/app/dashboard/Services/cardService';
import { ConvertCardIdArrayToNumericArray, ConvertCardIdToNumeric } from '@/app/dashboard/Utilities/cardUtilities';
import { UpdateCardOrder } from '@/app/dashboard/Types/boardTypes';

import {Debug} from '@dnd-kit/dom/plugins/debug';
import { GetBoardRequest } from '@/app/dashboard/Services/boardService';
import { NormaliseBoardData } from '@/app/dashboard/Utilities/boardData';

type previousCardOrder = {
    cardId: CardId;
    listId: ListId; 
    index: number; 
}

export default function BoardContent() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const boardDetials = useBoardStore((state) => state.currentBoardData); 
    const listOrder = useBoardStore((state) => state.listOrder); 
    const lastUsedBoardExists = useBoardStore((state) => state.lastUsedBoardExists); 
    const setListOrder = useBoardStore((state) => state.setListOrder);
    const moveCard = useBoardStore((state) => state.moveCard); 
    const setBoardError = useBoardStore((state) => state.setBoardError); 
    const getCardIDsInOrderFromList = useBoardStore((state) => state.getCardIDsInOrderFromList); 
    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 

    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const isCreateNewCardPanelOpen = useBoardUIStore((state) => state.activePanel === 'createNewCardPanel'); 
    const isDeleteListDialogBoxOpen = useBoardUIStore((state) => state.activePanel === 'deleteListDialogBox'); 
    const isCardDetailsPanelOpen = useBoardUIStore((state) => state.activePanel === 'cardDetailsPanel'); 

    const [currentOpenListMenu, setCurrentOpenListMenu] = useState<ListId | undefined>(undefined); 
    
    // list to which the new card will be added
    const [createNewCardListId, setCreateNewCardListId] = useState<number | undefined>(undefined); 

    const cardDetailsPanelData = useBoardUIStore((state) => state.cardDetailsPanelData); 

    const previousListOrder = useRef(listOrder); 
    const previousCardOrder = useRef<previousCardOrder>(null); 

    async function handleListReOrder(boardId: number, newListOrder: ListId[]) {
        const listIDsInOrder: number[] = [];

        for(const listId of newListOrder) {
            const idAsNumber = ConvertListIdToNumeric(listId); 
            if (idAsNumber === -1) {
                setBoardError(`We couldn't save your new list order. Please try again`); 
                setListOrder(previousListOrder.current);
                return; 
            }
            listIDsInOrder.push(idAsNumber); 
        }

        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateListOrderRequest, {
            boardId: boardId, listIDsInOrder: listIDsInOrder
        });

        if (request.ok) {
            setBoardError(''); 
            previousListOrder.current = [...newListOrder]; 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
            setListOrder(previousListOrder.current); 
        } else {
            setBoardError(`We couldn't save your new list order. Please try again`); 
            const refreshSuccessful = await RefreshBoardData(boardId); 
            if (!refreshSuccessful) {
                setBoardError(`We couldn't save your new list order. Please check your Internet connection.`); 
            }
        }
    }

    async function RefreshBoardData(boardId: number) {
        const boardRequest = await ApiRequestWithRefreshTokenAttemptAndData(GetBoardRequest, boardId); 

        if (boardRequest.ok && boardRequest.data !== undefined) {
            hydrateBoard(NormaliseBoardData(boardRequest.data)); 
            return true; 
        } else if (!boardRequest.ok && boardRequest.error === 'Unauthorized') {
            setSessionExpired(true); 
        }

        return false;
    }

    async function handleCardReOrder(boardId: number, currentListId: ListId, currentIndex: number) {
        if (previousCardOrder.current === null) {
            return; 
        } else if (previousCardOrder.current.index === currentIndex && 
            previousCardOrder.current.listId === currentListId) {
            return; 
        }

        const previousListIdAsNumber = ConvertListIdToNumeric(previousCardOrder.current.listId); 
        const currentListIdAsNumber = ConvertListIdToNumeric(currentListId);

        const previousListCardIDs = getCardIDsInOrderFromList(previousCardOrder.current.listId); 
        const currentListCardIDs = getCardIDsInOrderFromList(currentListId); 

        if (!previousListCardIDs || !currentListCardIDs ||
            previousListIdAsNumber === -1 || currentListIdAsNumber === -1
        ) {
            setBoardError('Failed to Re-order cards, please try again.'); 
            // move cards back to original state
            moveCard(previousCardOrder.current.cardId, currentListId, previousCardOrder.current.listId, previousCardOrder.current.index);
            return; 
        } 

        const previousListCardIDsAsNumber = ConvertCardIdArrayToNumericArray(previousListCardIDs); 
        const currentListCardIDsAsNumber = ConvertCardIdArrayToNumericArray(currentListCardIDs); 

        if (!previousListCardIDsAsNumber || !currentListCardIDsAsNumber) {
            setBoardError('Failed to Re-order cards, please try again.'); 
            // move cards back to original state
            moveCard(previousCardOrder.current.cardId, currentListId, previousCardOrder.current.listId, previousCardOrder.current.index);
            return; 
        } 

        const cardOrderArray: UpdateCardOrder = [{
            listId: currentListIdAsNumber,
            cardIDsInOrder: currentListCardIDsAsNumber, 
        }]; 

        // Add previous list details if card is moved from another list

        if (previousCardOrder.current.listId !== currentListId) {
            cardOrderArray.push({listId: previousListIdAsNumber, cardIDsInOrder: previousListCardIDsAsNumber}); 
        }
        
        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateCardOrderRequest, {
            boardId: boardId, CardOrder: cardOrderArray, }); 

        if (request.ok) {
            setBoardError(''); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
            // move cards back to original state
            moveCard(previousCardOrder.current.cardId, currentListId, previousCardOrder.current.listId, previousCardOrder.current.index);
        } else {
            setBoardError('Failed to Re-order cards, please try again.'); 
            const refreshSuccessful = await RefreshBoardData(boardId); 
            if (!refreshSuccessful) {
                setBoardError(`Failed to Re-order cards, Please check your Internet connection.`); 
            }
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

    const viewOnly = boardDetials.role === 'Viewer'; 

    return (
        <DragDropProvider
            modifiers={(defaults) => [...defaults, RestrictToWindow]}
            // plugins={(defaults) => [...defaults, Debug] }
            onDragStart={(event) => {
                const {source, target} = event.operation; 
                if (source === null || target === null) {
                    return;
                }
                
                // console.log(`SourceData: ${JSON.stringify(source.data)}, TargetData: ${JSON.stringify(target.data)}, ST: ${source.type}, TT: ${target.type}`)

                if (source.type === 'boardList' && target.type === 'boardList') {
                    previousListOrder.current = [...listOrder]; 
                } else {
                    previousCardOrder.current = {
                        cardId: source.id as CardId, 
                        listId: source.data.parentListId, 
                        index: source.data.index,
                    }; 
                }
                
            }}
            onDragOver={(event) => {
                const {source, target} = event.operation; 
                if (source === null || target === null) {
                    return;
                }

                if (source.data.parentListId === target.data.parentListId && source.data.index === target.data.index) {
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

                // console.log(`SourceData: ${JSON.stringify(source.data)}, TargetData: ${JSON.stringify(target.data)}, SID: ${source.id}, TID: ${target.id}`)

                if (source.type === 'boardList' && target.type === 'boardList') {
                    const newOrder = move(listOrder, event); 
                    setListOrder(newOrder); 
                    handleListReOrder(boardDetials.id, newOrder); 
                } else {
                    handleCardReOrder(boardDetials.id, source.data.parentListId, source.data.index); 
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
                { isCardDetailsPanelOpen && cardDetailsPanelData && 
                    <BoardCardDetails boardId={boardDetials.id} cardId={cardDetailsPanelData.cardId} 
                    parentListId={cardDetailsPanelData.parentListId} viewOnlyBoard={viewOnly} /> }
            </div>
        </DragDropProvider>
    )
}