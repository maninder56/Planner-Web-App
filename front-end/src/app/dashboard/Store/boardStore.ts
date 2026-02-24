import { create } from "zustand";
import { BoardDataFromAPI, BoardColour, CardPriority, ListColour } from "../Types/boardTypes";



type BoardData = {
    id: number, 
    title: string, 
    idFavoriteBoard: boolean, 
    boardColour: BoardColour,
}

type ListId = `list-${number}`; 
type CardId = `card-${number}`; 

type List = {
    id: number, 
    title: string, 
    listColour: ListColour, 
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
    boardData?: BoardData, 
    lists: Record<ListId, List>, 
    cards: Record<CardId, Card>, 
    listOrder: ListId[], 
}


type Action = {
    hydrateBoard: (data: NormalisedBoardData) => void; 

    setListOrder: (newListOrder: ListId[]) => void; 

    moveCard: (cardId: CardId, sourceListId: ListId, destinationListId: ListId, destinationIndex: number) => void; 
}

export const useBoardStore = create<State & Action>((set) => ({
    boardData: undefined, 
    lists: {}, 
    cards: {}, 
    listOrder: [],


    hydrateBoard: (data) => set(() => ({
        boardData: data.boardData, 
        lists: data.lists, 
        cards: data.cards, 
        listOrder: data.listOrder, 
    })), 

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

}))


export type { BoardData, ListId, List, CardId, Card, NormalisedBoardData }; 

