import { BoardData, Card, CardId, List, ListId, NormalisedBoardData } from "../Store/boardStore";
import { Filters } from "../Store/boardUIStore";
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


export const dateFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }); 


export function matchFilter(card: Card, filters: Filters) {
    // // If no filters are active, show everything
    // const activeFilters = Object.entries(filters).filter(([_, value]) => value === true);
    // if (activeFilters.length === 0) return true;

    // Status Category 
    if (filters.cardStatusCompleted || filters.cardStatusNotCompleted) {
        const matchesStatus = (filters.cardStatusCompleted && card.done) || 
                              (filters.cardStatusNotCompleted && !card.done);
        if (!matchesStatus) return false;
    }

    // Priority Category
    if (filters.priorityHigh || filters.priorityMedium || filters.priorityLow) {
        const matchesPriority = (filters.priorityHigh && card.priority === 'High') ||
                                (filters.priorityMedium && card.priority === 'Medium') ||
                                (filters.priorityLow && card.priority === 'Low');
        if (!matchesPriority) return false;
    }

    // Due Date Category
    if (filters.dueOverdue || filters.dueTomorrow || filters.dueThisWeek || filters.dueThisMonth) {
        if (!card.dueDate) return false;

        const cardDate = new Date(card.dueDate);
        if (Number.isNaN(cardDate.getTime())) {
            console.error(`Invalid date found on card: ${card.id}`);
            return false; 
        }

        cardDate.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let matchesDate = false;

        if (filters.dueOverdue && cardDate < today) {
            matchesDate = true;
        } else if (filters.dueTomorrow) {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            if (cardDate.getTime() === tomorrow.getTime()) matchesDate = true;
        } else if (filters.dueThisWeek) {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            if (cardDate >= startOfWeek && cardDate <= endOfWeek) matchesDate = true;
        } else if (filters.dueThisMonth) {
            if (cardDate.getMonth() === today.getMonth() && 
                cardDate.getFullYear() === today.getFullYear()) matchesDate = true;
        }

        if (!matchesDate) return false;
    }

    // If it passed all active category checks
    return true;
}

