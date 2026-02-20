import { BoardData, Card, CardId, List, ListId, NormalisedBoardData } from "../Store/boardStore";
import { BoardDataFromAPI } from "../Types/boardTypes";


export function NormaliseBoardData(data: BoardDataFromAPI): NormalisedBoardData {
    const boardData: BoardData = {
        id: data.id, 
        title: data.title, 
        idFavoriteBoard: data.isFavoriteBoard, 
        boardColour: data.boardColour,
    }; 

    let lists: Record<ListId, List> = {}; 
    let cards: Record<CardId, Card> = {}; 
    let listOrder: number[] = []; 

    for (let list of data.boardLists) {

        let cardIds = []; 

        for (let card of list.cardList) {
            cards[`card-${card.id}`] = {
                id: card.id, 
                title: card.title, 
                description: card.description, 
                done: card.done, 
                priority: card.priority, 
                dueDate: card.dueDate, 
                position: card.position,
            }; 

            cardIds.push(card.id); 
        }

        lists[`list-${list.id}`]  = {
            id: list.id, 
            title: list.title, 
            listColour: list.listColour, 
            position: list.position, 
            CardIDsAndOrder: cardIds, 
        }; 

        listOrder.push(list.id); 
    }

    const normalisedData: NormalisedBoardData = {
        boardData: boardData, 
        lists: lists, 
        cards: cards, 
        listOrder: listOrder,
    }; 

    return normalisedData; 
}