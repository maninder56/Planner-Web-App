import { create } from "zustand";
import { BoardDataFromAPI, BoardColour, CardPriority, UserRole, BoardArray } from "../Types/boardTypes";



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
    title: string, 
    position: number,
    CardIDsAndOrder: CardId[],
}

type Card = { 
    id: number,
    title: string, 
    description: string, 
    done: boolean, 
    priority: CardPriority,
    dueDate: Date, 
    position: number, 
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
    boardError: string; 
}


type Action = {
    setBoardLoading: (isLoading: boolean) => void; 
    setBoards: (boards: BoardArray) => void; 

    setCurrentBoardName: (boardName: string) => void; 
    setCurrentBoardFavourite: (isFavourite: boolean) => void; 
    setCurrentBoardColour: (colour: BoardColour) => void; 

    resetCurrentBoardData: () => void; 

    hydrateBoard: (data: NormalisedBoardData) => void; 
    resetBoardData: () => void; 
    
    AddNewBoardToBoardArray: (board: BoardDataFromAPI) => void; 
    resetBoardArray: () => void; 

    setLastUsedBoardExists: (exists?: boolean) => void; 

    setBoardError: (error: string) => void; 

    // Lists operations
    AddNewListToBoard: (data: {id: number, title: string, position: number}) => void; 

    // re-ordering
    setListOrder: (newListOrder: ListId[]) => void; 
    moveCard: (cardId: CardId, sourceListId: ListId, destinationListId: ListId, destinationIndex: number) => void; 
    
    // Card actions
    setDoneOnCard: (cardId: CardId, done: boolean) => void; 
}

export const useBoardStore = create<State & Action>((set) => ({
    isBoardLoading: true,
    boards: null, 
    currentBoardData: undefined, 
    lastUsedBoardExists: undefined, 
    lists: {}, 
    cards: {}, 
    listOrder: [],
    boardError: '', 

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
        boards: state.boards === null ? [board] : [...state.boards, board],
    })), 

    resetBoardArray: () => set(() => ({
        boards: null, 
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

    resetCurrentBoardData: () => set(() => ({
        currentBoardData: undefined, 
        lists: {}, 
        cards: {}, 
        listOrder: [], 
    })), 
    

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

    AddNewListToBoard: (data) => set((state) => {
        const listId = `list-${data.id}` as ListId; 

        return {
            lists: {
                ...state.lists, 
                [listId]: {
                    id: data.id, 
                    title: data.title, 
                    position: data.position,
                    CardIDsAndOrder: []
                }
            }, 
            listOrder: [...state.listOrder, listId],
        }
    }), 


    setListOrder: (newListOrder) => set(() => ({ listOrder: newListOrder })), 
    
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

            const newSourceCardIds = sourceList.CardIDsAndOrder.filter(id => id !== cardId); 
            const newTargetCardTds = [...targetList.CardIDsAndOrder]; 
            newTargetCardTds.splice(targetIndex, 0, cardId); 

            return {
                lists: {
                    ...state.lists, 
                    [sourceListId]: {
                        ...sourceList, 
                        CardIDsAndOrder: newSourceCardIds,
                    }, 
                    [targetListId]: {
                        ...targetList, 
                        CardIDsAndOrder: newTargetCardTds,
                    }
                }
            }
        }), 

        setDoneOnCard: (cardId, done) => set((state) => ({ 
            cards: {
                ...state.cards, 
                [cardId]: {
                    ...state.cards[cardId],
                    done: done, 
                }, 
            }
        })), 

}))


export type { BoardData, ListId, List, CardId, Card, NormalisedBoardData }; 

