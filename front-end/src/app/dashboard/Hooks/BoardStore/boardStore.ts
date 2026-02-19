import { create } from "zustand";
import { Board, BoardColour, CardPriority, ListColour } from "../../Types/boardTypes";



type BoardData = {
    id: number, 
    title: string, 
    favoriteBoard: boolean, 
    boardColour: BoardColour,
}

type ListId = number; 
type CardId = number; 

type List= {
    id: number, 
    title: string, 
    listColour: ListColour, 
    position: number,
    CardIDs: CardId[],
}

type Card = { 
    id: number,
    title: string, 
    Description: string, 
    done: boolean, 
    priority: CardPriority,
    dueDate: Date, 
    position: number, 
}

type NormalisedBoardData = {
    boardData: BoardData, 
    lists: Record<ListId, List>, 
    cards: Record<CardId, Card>, 
    listOrder: number[], 
}

type State = {
    boardData?: BoardData, 
    lists: Record<ListId, List>, 
    cards: Record<CardId, Card>, 
    listOrder: number[], 
}


type Action = {
    hydrateBoard: (data: NormalisedBoardData) => void; 
}

const useBoardStore = create<State & Action>((set) => ({
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

    

}))


export type { NormalisedBoardData, useBoardStore }; 