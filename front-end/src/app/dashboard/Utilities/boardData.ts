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

    if (data.boardLists === undefined) {
        return normalisedData; 
    }

    for (let list of data.boardLists) {

        let cardIds: CardId[] = []; 

        if (list.cardList !== undefined) {
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

                cardIds.push(`card-${card.id}`); 
            }
        }

        lists[`list-${list.id}`]  = {
            id: list.id, 
            title: list.title, 
            position: list.position, 
            CardIDsAndOrder: cardIds, 
        }; 

        listOrder.push(`list-${list.id}`); 
    }

    normalisedData.lists = lists; 
    normalisedData.cards = cards; 
    normalisedData.listOrder = listOrder; 

    return normalisedData; 
}