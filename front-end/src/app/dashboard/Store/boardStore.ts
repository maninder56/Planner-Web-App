import { create } from "zustand";
import { BoardDataFromAPI, BoardColour, CardPriority, UserRole, BoardArray, CardUpdated, UpdateCard, OnlineUser, NewListAdded, ListNameUpdated, NewCardAdded, CardHasBeenDeletedData, ListHasBeenDeletedData, BoardHasBeenDeletedData, CardHasBeenUpdatedData, ListPositionChangedData, CardPositionChangedData, BoardInfoChangedData, CardLockInfo, CurrentlyLockedCardsData } from "../Types/boardTypes";



type BoardData = {
    id: number, 
    title: string, 
    idFavouriteBoard: boolean,
    role: UserRole, 
    boardColour: BoardColour,
}

type ListId = `list-${number}`; 
type CardId = `card-${number}`; 

type List = {
    id: number, 
    name: string, 
    position: number,
    CardIDsAndOrder: CardId[],
    activityMessage?: string, 
}

type Card = { 
    id: number,
    name: string, 
    description: string, 
    done: boolean, 
    priority: CardPriority,
    dueDate: string, 
    position: number, 
    activityMessage?: string, 
    cardLockInfo?: CardLockInfo,  
}

type NormalisedBoardData = {
    boardData: BoardData, 
    lists: Record<ListId, List>, 
    cards: Record<CardId, Card>, 
    listOrder: ListId[], 
}

type State = {
    isBoardLoading: boolean; 
    lastUsedBoardExists?: boolean; 
    boards: BoardArray | null; 
    currentBoardData?: BoardData, 
    lists: Record<ListId, List>, 
    cards: Record<CardId, Card>, 
    listOrder: ListId[], 
    boardError: string, 
    onlineUsers: Map<number, OnlineUser>, 
    globalActivityMessage?: string; 
}


type Action = {
    setBoardLoading: (isLoading: boolean) => void; 
    setBoards: (boards: BoardArray) => void; 

    // Board operations
    setCurrentBoardName: (boardName: string) => void; 
    setCurrentBoardFavourite: (isFavourite: boolean) => void; 
    setCurrentBoardColour: (colour: BoardColour) => void; 

    updateBoardColour: (colour: BoardColour, boardId: number) => void; 
    resetCurrentBoardData: () => void; 
    DeleteBoardFromSignalR: (data: BoardHasBeenDeletedData, activityMessage?: string) => void;
    UpdateBoardInfoFromSignalR: (data: BoardInfoChangedData, byUserName?: string) => void; 

    hydrateBoard: (data: NormalisedBoardData) => void; 
    resetBoardData: () => void; 

    
    // Board array 
    AddNewBoardToBoardArray: (board: BoardDataFromAPI) => void; 
    RemoveBoardFromBoardArray: (boardId: number) => void; 
    resetBoardArray: () => void; 

    setLastUsedBoardExists: (exists?: boolean) => void; 

    setBoardError: (error: string) => void; 

    // Lists operations
    AddNewListToBoard: (data: {id: number, title: string, position: number}) => void; 
    AddNewListToBoardFromSignalR: (data: NewListAdded, activityMessage?: string) => void; 
    UpdateListName: (listId: ListId, newName: string) => void; 
    UpdateListNameFromSignalR: (data: ListNameUpdated, activityMessage?: string) => void; 
    deleteList: (ListId: ListId) => void; 
    DeleteListFromBoardFromSignalR: (data: ListHasBeenDeletedData, activityMessage?: string) => void; 
    getCardIDsInOrderFromList: (listId: ListId) => CardId[] | undefined; 
    setListActivityMessage: (listId: ListId, message?: string) => void; 

    // re-ordering
    setListOrder: (newListOrder: ListId[]) => void; 
    moveCard: (cardId: CardId, sourceListId: ListId, destinationListId: ListId, destinationIndex: number) => void; 
    UpdateListOrderFromSignalR: (data: ListPositionChangedData, activityMessage?: string) => void; 
    UpdateCardOrderFromSignalR: (data: CardPositionChangedData, activityMessage?: string) => void; 
    
    // Card actions
    setDoneOnCard: (cardId: CardId, done: boolean) => void; 
    addNewCard: (parentListId: number, card: Card) => void;
    AddNewCardFromSignalR: (data: NewCardAdded, activityMessage?: string) => void; 
    updateCardInfo: (cardId: CardId, cardUpdate: UpdateCard) => void; 
    UpdateCardFromSignalR: (data: CardHasBeenUpdatedData, activityMessage?: string) => void; 
    deleteCard: (listIdAsNumber: number, cardIdAsNumber: number) => void; 
    DeleteCardFromListFromSignalR: (data: CardHasBeenDeletedData, activityMessage?: string) => void; 
    setCardActivityMessage: (cardId: CardId, message?: string) => void; 
    UpdateCardLockedStateFromSignalR: (data: CurrentlyLockedCardsData) => void; 


    // online users 
    addNewOnlineUser: (user: OnlineUser) => void; 
    removeOnlineUser: (userId: number) => void; 
    setOnlineUsers: (users: OnlineUser[]) => void; 
    clearOnlineUsers: () => void; 

    // board activity
    setBoardActivityMessage: (newMessage?: string) => void; 
}

export const useBoardStore = create<State & Action>((set, get) => ({
    isBoardLoading: true,
    boards: null, 
    currentBoardData: undefined, 
    lastUsedBoardExists: undefined, 
    lists: {}, 
    cards: {}, 
    listOrder: [],
    boardError: '', 
    onlineUsers: new Map(),
    globalActivityMessage: '', 

    setBoardLoading: (isLoading) => {
      set(() => ({ isBoardLoading: isLoading }))  
    }, 

    setLastUsedBoardExists: (exists) => {
        set(() => ({ lastUsedBoardExists: exists}))
    }, 

    // set all the boards user has access to
    setBoards: (boards) => set(() => ({
        boards: boards,
    })),

    AddNewBoardToBoardArray: (board) => set((state) => ({
        boards: state.boards === null ? null : [...state.boards, board],
    })), 

    resetBoardArray: () => set(() => ({
        boards: null, 
    })), 

    RemoveBoardFromBoardArray: (boardId) => set((state) => ({
        boards: state.boards === null ? null :  
            state.boards.filter(b => b.boardId !== boardId)
    })), 



    // set current board data 
    setCurrentBoardName: (name) => set((state) => ({
        currentBoardData: state.currentBoardData === undefined ? undefined : 
            { ...state.currentBoardData, title: name }
    })), 

    setCurrentBoardFavourite: (isFavourite) => set((state) => ({
        currentBoardData: state.currentBoardData === undefined ? undefined : 
            { ...state.currentBoardData, idFavouriteBoard: isFavourite }
    })), 

    setCurrentBoardColour: (colour) => set((state) => ({
        currentBoardData: state.currentBoardData === undefined ? undefined : 
            { ...state.currentBoardData, boardColour: colour }
    })), 

    updateBoardColour: (colour, boardId) => set((state) => {
        let newBoardData = state.currentBoardData === undefined ? undefined : 
            { ...state.currentBoardData }; 

        if (newBoardData !== undefined && newBoardData.id === boardId) {
            newBoardData = {...newBoardData, boardColour: colour}; 
        }

        let newBoardArray = state.boards === null ? null : 
            state.boards.map(b => {
                if (b.boardId === boardId) {
                    return {...b, backgroundColour: colour, }; 
                } else {
                    return b; 
                }
            }); 


        return {
            currentBoardData: newBoardData, 
            boards: newBoardArray, 
        }
    }), 

    resetCurrentBoardData: () => set(() => ({
        currentBoardData: undefined, 
        lists: {}, 
        cards: {}, 
        listOrder: [], 
        onlineUsers: new Map(),
    })), 

    DeleteBoardFromSignalR: (data, activityMessage) => set((state) => {
        if (state.currentBoardData?.id !== data.boardId) {
            return state; 
        }

        const newBoardsArray = state.boards === null ? null : 
            state.boards.filter(b => b.boardId !== data.boardId); 

        return {
            lastUsedBoardExists: false, 
            boards: newBoardsArray, 
            currentBoardData: undefined, 
            lists: {}, 
            cards: {}, 
            listOrder: [], 
            onlineUsers: new Map(),
            globalActivityMessage: activityMessage, 
        }
    }),

    UpdateBoardInfoFromSignalR: (data, byUserName) => set((state) => {
        if (state.currentBoardData?.id !== data.boardId) {
            return state; 
        }

        const changes = [];

        if (data.newBackgroundColour) changes.push('Board Colour Changed');
        if (data.newBoardName) changes.push('Board Name Changed');

        const globalActivityMessage = changes.length > 0
                ? `${changes.join(' and ')}${byUserName ? ` by ${byUserName}` : ''}`
                : undefined;

        const newBoard: BoardData = {
            ...state.currentBoardData, 
            title: data.newBoardName ?? state.currentBoardData.title, 
            boardColour: data.newBackgroundColour ?? state.currentBoardData.boardColour, 
        }

        const newBoardArray = state.boards === null ? null : 
            state.boards.map(b => {
                if (b.boardId === data.boardId) {
                    return {
                        ...b, 
                        name: data.newBoardName ?? b.name, 
                        backgroundColour: data.newBackgroundColour ?? b.backgroundColour, 
                    }; 
                } else {
                    return b; 
                }
            }); 
        
        return {
            currentBoardData: newBoard, 
            boards: newBoardArray, 
            globalActivityMessage: globalActivityMessage, 
        }
    }),
    

    hydrateBoard: (data) => {
      set(() => ({
            currentBoardData: data.boardData, 
            lists: data.lists, 
            cards: data.cards, 
            listOrder: data.listOrder, 
        })); 
    }, 

    resetBoardData: () => {
        set(() => ({ 
            isBoardLoading: true,
            boards: null, 
            currentBoardData: undefined, 
            lastUsedBoardExists: undefined,
            lists: {}, 
            cards: {}, 
            listOrder: [], 
         })); 
    }, 

    setBoardError: (error) => set(() => ({
        boardError: error, 
    })), 


    // Lists operations 

    UpdateListName: (listId, newName) => set((state) => {
        const list = state.lists[listId]; 
        if (!list) {
            return state; 
        }

        return {
            lists: {
                ...state.lists, 
                [listId]: {
                    ...list, 
                    name: newName, 
                }
        }
        }
    }), 

    UpdateListNameFromSignalR: (data, activityMessage) => set((state) => {
        if (data.boardId !== state.currentBoardData?.id) {
            return state; 
        }

        const listId: ListId = `list-${data.listId}`; 
        const list = state.lists[listId]; 

        if (!list) {
            return state; 
        }

        const newList: List = {
            ...list,
            name: data.newName, 
            activityMessage: activityMessage,
        }

        return {
            lists: {
                ...state.lists, 
                [listId]: newList
            }
        }
    }), 

    AddNewListToBoard: (data) => set((state) => {
        const listId: ListId = `list-${data.id}`; 

        if (state.lists[listId]) {
            return state; 
        }

        return {
            lists: {
                ...state.lists, 
                [listId]: {
                    id: data.id, 
                    name: data.title, 
                    position: data.position,
                    CardIDsAndOrder: []
                }
            }, 
            listOrder: [...state.listOrder, listId],
        }
    }), 

    AddNewListToBoardFromSignalR: (data, activityMessage) => set((state) => {
        if (data.boardId !== state.currentBoardData?.id) {
            return state; 
        }

        const listId: ListId = `list-${data.listId}`; 

        if (state.lists[listId]) {
            return state; 
        }

        const newLists: Record<ListId, List> = {
            ...state.lists, 
            [listId]: {
                id: data.listId, 
                name: data.name, 
                position: data.listPosition, 
                CardIDsAndOrder: [], 
                activityMessage: activityMessage,
            }
        }; 

        const newListOrder: ListId[] = Object.entries(newLists)
            .sort(([, a], [, b]) => a.position - b.position)
            .map(([id]) => id as ListId); 

        return {
            lists: newLists, 
            listOrder: newListOrder, 
        }

    }),

    deleteList: (listId) => set((state) => {
        const list = state.lists[listId]; 

        if (!list) {
            return state; 
        }

        const cardIdsToDelete = new Set(list.CardIDsAndOrder); 

        // filter cards
        const newCards = Object.fromEntries(
            Object.entries(state.cards).filter(
                ([cardId]) => !cardIdsToDelete.has(cardId as CardId))
        ); 

        // filter lists
        const newLists = Object.fromEntries(
            Object.entries(state.lists).filter(([Id]) => Id !== listId)
        );
    
        // filter list order 
        const newListOrder = state.listOrder.filter(id => id !== listId); 

        return {
            cards: newCards, 
            lists: newLists, 
            listOrder: newListOrder, 
        };
    }), 


    DeleteListFromBoardFromSignalR: (data, activityMessage) => set((state) => {
        if (data.boardId !== state.currentBoardData?.id) {
            return state; 
        }

        const listId: ListId = `list-${data.listId}`; 

        const list = state.lists[listId]; 

        if (!list) {
            return state; 
        }

        const cardIdsToDelete = new Set(list.CardIDsAndOrder); 

        // filter cards
        const newCards = Object.fromEntries(
            Object.entries(state.cards).filter(
                ([cardId]) => !cardIdsToDelete.has(cardId as CardId))
        ); 

        // filter lists
        const newLists = Object.fromEntries(
            Object.entries(state.lists).filter(([Id]) => Id !== listId)
        );
    
        // filter list order 
        const newListOrder = state.listOrder.filter(id => id !== listId); 

        return {
            cards: newCards, 
            lists: newLists, 
            listOrder: newListOrder, 
            globalActivityMessage: activityMessage, 
        };
    }), 


    getCardIDsInOrderFromList: (listId) => {
        const { lists } = get(); 
        const list = lists[listId]; 

        if (!list) {
            return undefined; 
        }

        return list.CardIDsAndOrder; 
    }, 


    setListOrder: (newListOrder) => set(() => ({ listOrder: newListOrder })), 

    UpdateListOrderFromSignalR: (data, activityMessage) => set((state) => {
        if (data.boardId !== state.currentBoardData?.id) {
            return state; 
        }

        const newListOrder: ListId[] = data.listOrder.map(id => `list-${id}` as ListId); 

        const positions = Object.fromEntries(
            newListOrder.map((id, index) => [id, index])
        ) as Record<ListId, number>; 

        const newLists: Record<ListId, List> = Object.fromEntries(Object.entries(state.lists)
            .map(([id, list]) => [
                id, 
                {
                    ...list, 
                    position: positions[id as ListId]
                }
            ])
        ); 

        return {
            listOrder: newListOrder, 
            globalActivityMessage: activityMessage, 
            lists: newLists, 
        }
    }),

    UpdateCardOrderFromSignalR: (data, activityMessage) => set((state) => {
        if (data.boardId !== state.currentBoardData?.id) {
            return state; 
        }

        const firstListId: ListId = `list-${data.firstList.listId}`; 
        const firstList = state.lists[firstListId]; 

        const secondListId: ListId | undefined = data.secondList 
            ? (`list-${data.secondList.listId}` as ListId)
            : undefined; 

        const secondList = secondListId && state.lists[secondListId];

        if (!firstList) {
            return state; 
        }

        const firstListCardIDsAndOrder = data.firstList.cardIDsInOrder
            .map(id => `card-${id}` as CardId); 

        const firstListCardPositions = Object.fromEntries(
            firstListCardIDsAndOrder.map((id, index) => [id, index])
        ) as Record<CardId, number>; 

        if (data.secondList === undefined) {
            const newLists: Record<ListId, List> = {
                ...state.lists, 
                [firstListId]: {
                    ...firstList, 
                    CardIDsAndOrder: firstListCardIDsAndOrder, 
                    activityMessage: activityMessage, 
                }
            }; 

            const newCards = { ...state.cards }; 

            for (const [cardId, position] of Object.entries(firstListCardPositions)) {
                const typedCardId = cardId as CardId;

                if (!newCards[typedCardId]) continue; 

                newCards[typedCardId] = {
                    ...newCards[typedCardId],
                    position: position,
                };
            }

            return {
                lists: newLists, 
                cards: newCards, 
            }
        } else if (!secondList) {
            return state; 
        } else {
            const secondListCardIDsAndOrder = data.secondList.cardIDsInOrder
                .map(id => `card-${id}` as CardId); 

            const secondListCardPositions = Object.fromEntries(
                secondListCardIDsAndOrder.map((id, index) => [id, index])
            ) as Record<CardId, number>; 

            const newCards = { ...state.cards }; 

            for (const [cardId, position] of Object.entries(firstListCardPositions)) {
                const typedCardId = cardId as CardId;

                if (!newCards[typedCardId]) continue; 

                newCards[typedCardId] = {
                    ...newCards[typedCardId],
                    position: position,
                };
            }

            for (const [cardId, position] of Object.entries(secondListCardPositions)) {
                const typedCardId = cardId as CardId;

                if (!newCards[typedCardId]) continue; 

                newCards[typedCardId] = {
                    ...newCards[typedCardId],
                    position: position,
                };
            }

            const newListsWithSecondList: Record<ListId, List> = {
                ...state.lists, 
                [firstListId]: {
                    ...firstList, 
                    CardIDsAndOrder: firstListCardIDsAndOrder, 
                    activityMessage: activityMessage, 
                }, 
                [secondListId]: {
                    ...secondList, 
                    CardIDsAndOrder: secondListCardIDsAndOrder, 
                    activityMessage: activityMessage, 
                }
            }; 

            return {
                lists: newListsWithSecondList, 
                cards: newCards, 
            }
        }
    }),

    setListActivityMessage: (listId, message) => set((state) => {
        const list = state.lists[listId]; 

        if (!list) {
            return state; 
        }

        return {
            lists: { 
                ...state.lists, 
                [listId]: {
                    ...list, 
                    activityMessage: message, 
                }
            }
        }
    }),
    

    // Card actions
    moveCard: (cardId, sourceListId, targetListId, targetIndex) => 
        set((state) => {
            // Moving in the same list
            if (sourceListId === targetListId) {
                const list = state.lists[sourceListId]; 
                
                const newCardOrder = [...list.CardIDsAndOrder]; 
                const currentIndex = newCardOrder.indexOf(cardId); 

                if (currentIndex === -1) {
                    return state; 
                }

                newCardOrder.splice(currentIndex, 1); 
                newCardOrder.splice(targetIndex, 0, cardId); 

                return {
                    lists: {
                        ...state.lists, 
                        [sourceListId]: {
                            ...list, 
                            CardIDsAndOrder: newCardOrder, 
                        }
                    }
                }
            } 

            const sourceList = state.lists[sourceListId]; 
            const targetList = state.lists[targetListId]; 

            if (!sourceList || !targetList) {
                return state; 
            }

            if (!sourceList.CardIDsAndOrder.includes(cardId)) {
                return state; 
            }

            const newSourceCardIds = sourceList.CardIDsAndOrder.filter(id => id !== cardId); 
            const newTargetCardIds = [...targetList.CardIDsAndOrder]; 
            newTargetCardIds.splice(targetIndex, 0, cardId); 

            return {
                lists: {
                    ...state.lists, 
                    [sourceListId]: {
                        ...sourceList, 
                        CardIDsAndOrder: newSourceCardIds,
                    }, 
                    [targetListId]: {
                        ...targetList, 
                        CardIDsAndOrder: newTargetCardIds,
                    }
                }
            }
        }), 

        setDoneOnCard: (cardId, done) => set((state) => { 
            const card = state.cards[cardId]; 

            if (!card) {
                return state; 
            }

            return {
                cards: {
                    ...state.cards, 
                    [cardId]: {
                        ...card,
                        done: done, 
                    }, 
                }
            }
        }), 

        addNewCard: (parentListId, card) => set((state) => {
            const cardId: CardId = `card-${card.id}`; 
            const listId: ListId = `list-${parentListId}`; 

            const list = state.lists[listId]; 

            if (!list) {
                return state; 
            }

            if (list.CardIDsAndOrder.includes(cardId)) {
                return state; 
            }

            return {
                cards: {
                    ...state.cards, 
                    [cardId]: card,
                }, 

                lists: {
                    ...state.lists, 
                    [listId]: {
                        ...list, 
                        CardIDsAndOrder: [...list.CardIDsAndOrder, cardId], 
                    }
                }
            }
        }), 

        AddNewCardFromSignalR: (data, activityMessage) => set((state) => {
            if (data.boardId !== state.currentBoardData?.id) {
                return state; 
            }

            const cardId: CardId = `card-${data.cardId}`; 
            const listId: ListId = `list-${data.boardListId}`; 

            const list = state.lists[listId]; 

            if (!list) {
                return state; 
            }

            if (list.CardIDsAndOrder.includes(cardId)) {
                return state; 
            }

            const newCards: Record<CardId, Card> = {
                ...state.cards, 
                [cardId]: {
                    id: data.cardId,
                    name: data.title,
                    description: data.description ?? '',
                    done: data.isDone,
                    priority: data.priority,
                    dueDate: data.dueDate,
                    position: data.cardPosition, 
                    activityMessage: activityMessage, 
                }
            }

            const newCardIDsAndOrder: CardId[] = [...list.CardIDsAndOrder, cardId]    
                .sort((a, b) => newCards[a].position - newCards[b].position); 
                
            const newLists: Record<ListId, List> = {
                ...state.lists, 
                [listId]: {
                    ...list, 
                    CardIDsAndOrder: newCardIDsAndOrder,
                }
            }

            return {
                lists: newLists, 
                cards: newCards, 
            }
        }),

        updateCardInfo: (cardId, updateCard) => set((state) => {
            const card = state.cards[cardId]; 

            if (!card) {
                return state; 
            }

            return {
                cards: {
                    ...state.cards, 
                    [cardId]: {
                        ...card, 
                        name: updateCard.Title ?? card.name, 
                        description: updateCard.Description ?? card.description, 
                        done: updateCard.IsDone ?? card.done, 
                        dueDate: updateCard.DueDate ?? card.dueDate, 
                        priority: updateCard.Priority ?? card.priority,
                    }
                }
            }
        }), 

        UpdateCardFromSignalR: (data, activityMessage) => set((state) => {
            if (state.currentBoardData?.id !== data.boardId) {
                return state; 
            }

            const cardId: CardId = `card-${data.cardId}`; 
            const card = state.cards[cardId]; 

            if (!card) {
                return state; 
            }

            return {
                cards: {
                    ...state.cards, 
                    [cardId]: {
                        ...card, 
                        name: data.title ?? card.name, 
                        description: data.description ?? card.description, 
                        done: data.isDone ?? card.done, 
                        dueDate: data.dueDate ?? card.dueDate, 
                        priority: data.priority ?? card.priority, 
                        activityMessage: activityMessage, 
                    }
                }
            }

            
        }),



        deleteCard: (listIdAsNumber, cardIdAsNumber) => set((state) => {
            const listId: ListId = `list-${listIdAsNumber}`; 
            const cardId: CardId = `card-${cardIdAsNumber}`; 

            const list = state.lists[listId]; 
            const card = state.cards[cardId]; 

            if (!list && !card) {
                return state; 
            }

            const updatedState: Partial<typeof state> = {}; 

            if (list) {
                updatedState.lists = {
                    ...state.lists, 
                    [listId]: {
                        ...list, 
                        CardIDsAndOrder: list.CardIDsAndOrder.filter(id => id !== cardId), 
                    }
                }
            }

            if (card) {
                 // filter cards
                const newCards = Object.fromEntries(Object.entries(state.cards)
                    .filter(([id]) => id !== cardId)); 

                updatedState.cards = newCards; 
            }

            return updatedState; 
        }), 

        DeleteCardFromListFromSignalR: (data, activityMessage) => set((state) => {
            if (data.boardId !== state.currentBoardData?.id) {
                return state; 
            }

            const listId: ListId = `list-${data.listId}`; 
            const cardId: CardId = `card-${data.cardId}`; 

            const list = state.lists[listId]; 
            const card = state.cards[cardId]; 

            if (!list && !card) {
                return state; 
            }

            const updatedState: Partial<typeof state> = {}; 

            if (list) {
                updatedState.lists = {
                    ...state.lists, 
                    [listId]: {
                        ...list, 
                        CardIDsAndOrder: list.CardIDsAndOrder.filter(id => id !== cardId), 
                        activityMessage: activityMessage, 
                    }
                }
            }

            if (card) {
                const newCards = Object.fromEntries(Object.entries(state.cards)
                    .filter(([id]) => id !== cardId)); 

                updatedState.cards = newCards; 
            }

            return updatedState; 
        }), 

        setCardActivityMessage: (cardId, message) => set((state) => {
            const card = state.cards[cardId]; 

            if (!card) {
                return state; 
            }

            return {
                cards: {
                    ...state.cards, 
                    [cardId]: {
                        ...card, 
                        activityMessage: message,
                    }
                }
            }
        }),

        UpdateCardLockedStateFromSignalR: (data) => set((state) => {
            const lockedCards = data.lockedCards; 
            const currentBoardId = state.currentBoardData?.id; 

            if (lockedCards === undefined || lockedCards.length === 0 || currentBoardId === undefined) {
                return state; 
            }

            const newCards = Object.fromEntries(
                Object.entries(state.cards).map(([id, card]) => [
                    id,
                    { ...card, cardLockInfo: undefined },
                ])
            ) as Record<CardId, Card>;

            let hasChanges = false; 

            for (const lockedCard of lockedCards) {
                if (lockedCard.boardId !== currentBoardId) continue; 

                const cardId: CardId = `card-${lockedCard.cardId}`; 
                const existingCard = newCards[cardId]; 
                if (!existingCard) continue; 

                newCards[cardId] = {
                    ...existingCard, 
                    cardLockInfo: lockedCard, 
                }

                hasChanges = true; 
            }

            if (!hasChanges) {
                return state; 
            }

            return {
                cards: newCards,
            }
        }),

        // online users 
        addNewOnlineUser: (user) => set((state) => ({
            onlineUsers: new Map(state.onlineUsers).set(user.userId, user),
        })), 

        removeOnlineUser: (userId: number) => set((state) => {
            const newOnlineUserMap = new Map(state.onlineUsers); 
            newOnlineUserMap.delete(userId); 
            
            return {
                onlineUsers: newOnlineUserMap,
            }
        }), 

        setOnlineUsers: (users) =>{
            const newMap = new Map(users.map(u => [u.userId, u])); 
            set({ onlineUsers: newMap }); 
        }, 

        clearOnlineUsers: () => set({ onlineUsers: new Map() }),

        setBoardActivityMessage: (newMessage) => set({ globalActivityMessage: newMessage }), 
}))


export type { BoardData, ListId, List, CardId, Card, NormalisedBoardData }; 

