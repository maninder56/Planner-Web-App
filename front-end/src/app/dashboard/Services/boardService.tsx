import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from "@/Utilities/ApiUtilities";
import z from "zod";
import { BoardSchema, BoardDataFromAPI } from "../Types/boardTypes";
import { ApiFetchRequest } from "@/Services/ApiRequest";

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

