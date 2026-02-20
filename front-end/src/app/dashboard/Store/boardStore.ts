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
    CardIDsAndOrder: number[],
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

    
    

}))


export type { BoardData, ListId, List, CardId, Card, NormalisedBoardData }; 