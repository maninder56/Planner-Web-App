import { BoardData, Card, CardId, List, ListId, NormalisedBoardData } from "../Store/boardStore";
import { BoardDataFromAPI } from "../Types/boardTypes";


export function NormaliseBoardData(data: BoardDataFromAPI): NormalisedBoardData {
    const boardData: BoardData = {
        id: data.boardId, 
        title: data.name, 
        idFavouriteBoard: data.isFavoriteBoard, 
        role: data.role,
        boardColour: data.backgroundColour,
    }; 

    // Sort the lists and cards in order by position

    let lists: Record<ListId, List> = {}; 
    let cards: Record<CardId, Card> = {}; 
    let listOrder: ListId[] = []; 

    let normalisedData: NormalisedBoardData = {
        boardData: boardData, 
        lists: lists, 
        cards: cards, 
        listOrder: listOrder,
    }; 

    if (data.boardList === undefined) {
        return normalisedData; 
    }

    for (let list of data.boardList) {

        let cardIds: CardId[] = []; 

        if (list.cardList !== undefined) {
            for (let card of list.cardList) {
                cards[`card-${card.cardId}`] = {
                    id: card.cardId, 
                    name: card.title, 
                    description: card.description, 
                    done: card.isDone, 
                    priority: card.priority, 
                    dueDate: card.dueDate, 
                    position: card.cardPosition,
                }; 

                cardIds.push(`card-${card.cardId}`); 
            }
        }

        lists[`list-${list.boardListId}`]  = {
            id: list.boardListId, 
            name: list.name, 
            position: list.listPosition, 
            CardIDsAndOrder: cardIds, 
        }; 

        listOrder.push(`list-${list.boardListId}`); 
    }

    normalisedData.lists = lists; 
    normalisedData.cards = cards; 
    normalisedData.listOrder = listOrder; 

    return normalisedData; 
}