import { ApiFetchRequest } from '@/Services/ApiRequest';
import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from '@/Utilities/ApiUtilities';
import { CardInfoSchema, CardUpdatedSchema, NewCard, UpdateCard, UpdateCardOrder } from '../Types/boardTypes';
import { CardSearchResultSchema } from '../Types/cardTypes';


const boardRoute = '/boards'; 


// Get requests

export async function SearchCardByKeywordRequest(keyword: string) {
    const subUrl = `/cards?search=${encodeURI(keyword)}`; 
    const request: RequestInit = {
        method: 'GET', 
        credentials: 'include',
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = CardSearchResultSchema.safeParse(data); 

            if (validData.success) {
                return ApiRequestSuccessfull(validData.data); 
            } else {
                console.error('Invalid data recieved from API'); 
                console.error(validData.error); 
                return ApiRequestFailed('DataValidationFailed'); 
            }
        } else {
            return ApiErrorFromStatusCode(response.status); 
        }
    } catch(error) {
        console.error('Error: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}



// Post requests


export async function CreateNewCardRequest(data: {
    boardId: number, 
    listId: number, 
    newCard: NewCard
}) {
    const subUrl = boardRoute + `/${data.boardId}/lists/${data.listId}/cards`; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'POST', 
        credentials: 'include',
        body: JSON.stringify(data.newCard),
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = CardInfoSchema.safeParse(data); 

            if (validData.success) {
                return ApiRequestSuccessfull(validData.data); 
            } else {
                console.error('Invalid data recieved from API'); 
                console.error(validData.error); 
                return ApiRequestFailed('DataValidationFailed'); 
            }
        } else {
            return ApiErrorFromStatusCode(response.status); 
        }
    } catch(error) {
        console.error('Error: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}



// Patch requests


export async function UpdateCardInfoRequest(data: {
    boardId: number, 
    listId: number, 
    cardId: number, 
    card: UpdateCard
}) {
    const subUrl = boardRoute + `/${data.boardId}/lists/${data.listId}/cards/${data.cardId}`; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'PATCH', 
        credentials: 'include',
        body: JSON.stringify(data.card),
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = CardUpdatedSchema.safeParse(data); 

            if (validData.success) {
                return ApiRequestSuccessfull(validData.data); 
            } else {
                console.error('Invalid data recieved from API'); 
                console.error(validData.error); 
                return ApiRequestFailed('DataValidationFailed'); 
            }
        } else {
            return ApiErrorFromStatusCode(response.status); 
        }
    } catch(error) {
        console.error('Error: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}




export async function UpdateCardOrderRequest(boardId: number, CardOrder: UpdateCardOrder) {
    const subUrl = boardRoute + `/${boardId}/cards/re-order`; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'PATCH', 
        credentials: 'include',
        body: JSON.stringify(CardOrder),
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            return ApiRequestSuccessfull(); 
        } else {
            return ApiErrorFromStatusCode(response.status); 
        }
    } catch(error) {
        console.error('Error: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}







