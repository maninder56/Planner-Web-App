import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from '@/Utilities/ApiUtilities';
import z from 'zod';
import { BoardSchema, BoardDataFromAPI, BoardColour } from '../Types/boardTypes';
import { ApiFetchRequest } from '@/Services/ApiRequest';

const boardRoute = '/boards'; 

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



export async function CreateNewBoardRequest(name: string, colour: BoardColour) {
    const subUrl = boardRoute; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'text/json',
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

