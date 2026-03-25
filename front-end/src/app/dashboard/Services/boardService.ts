import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from '@/Utilities/ApiUtilities';
import z from 'zod';
import { BoardSchema, BoardDataFromAPI, BoardColour, BoardArraySchema, BoardInfo, BoardInfoSchema } from '../Types/boardTypes';
import { ApiFetchRequest } from '@/Services/ApiRequest';

const boardRoute = '/boards'; 


// Get requests

export async function GetAllBoardsRequest() {
    const subUrl = boardRoute; 
    const request: RequestInit = {
        method: 'GET', 
        credentials: 'include',
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = BoardArraySchema.safeParse(data); 

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



export async function GetBoardRequest(boardId: number) {
    const subUrl = boardRoute + `/${boardId}`; 
    const request: RequestInit = {
        method: 'GET', 
        credentials: 'include',
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = BoardArraySchema.safeParse(data); 

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


export async function LastUsedBoardRequest() {
    const subUrl = boardRoute + '/last-used'; 
    const request: RequestInit = {
        method: 'GET', 
        credentials: 'include',
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = BoardSchema.safeParse(data); 

            if (validData.success) {
                return ApiRequestSuccessfull(validData.data); 
            } else {
                console.error('Invalid data recieved from API'); 
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



// Post Requests

export async function CreateNewBoardRequest(name: string, colour: BoardColour) {
    const subUrl = boardRoute; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'POST', 
        credentials: 'include',
        body: JSON.stringify({
            Name: name,
            BackgroundColour: colour,
        }),
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = BoardSchema.safeParse(data); 

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




// Patch Requests

export async function UpdateBoardInfoRequest(boardId: number, boardInfo: BoardInfo) {
    const subUrl = boardRoute + `/${boardId}`; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'PATCH', 
        credentials: 'include',
        body: JSON.stringify({
            Name: boardInfo.name, 
            IsFavoriteBoard: boardInfo.isFavoriteBoard, 
            BackgroundColour: boardInfo.backgroundColour,      
        }),
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = BoardInfoSchema.safeParse(data); 

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



export async function UpdateLastUsedBoardRequest(newLastUsedBoardId: number) {
    const subUrl = boardRoute + '/last-used'; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'PATCH', 
        credentials: 'include',
        body: JSON.stringify({
            LastUsedBoardId: newLastUsedBoardId,    
        }),
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




// Delete Requests

export async function DeleteBoardRequest(boardId: number) {
    const subUrl = boardRoute + `/${boardId}`; 
    const request: RequestInit = {
        method: 'DELETE', 
        credentials: 'include',
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




