import { ApiFetchRequest } from '@/Services/ApiRequest';
import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from '@/Utilities/ApiUtilities';
import { ChangeListInfo, ChangeListInfoSchema, NewListResponseSchema } from '../Types/listTypes';

const boardRoute = '/boards';


// ----------------------
// POST REQUESTS
// ----------------------

export async function CreateNewListRequest(data: {boardId: number, newListName: string}) {
    const subUrl = boardRoute + `/${data.boardId}/lists`;
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            Name: data.newListName, 
        }),
    };

    try {
        const response = await ApiFetchRequest(subUrl, request);

        if (response.ok) {
            const data = await response.json();
            const validData = NewListResponseSchema.safeParse(data);

            if (validData.success) {
                return ApiRequestSuccessfull(validData.data);
            } else {
                console.error('Invalid data received from API');
                console.error(validData.error);
                return ApiRequestFailed('DataValidationFailed');
            }
        } else {
            return ApiErrorFromStatusCode(response.status);
        }
    } catch (error) {
        console.error('Error: ', error);
        return ApiRequestFailed('FetchRequestFailed');
    }
}


// ----------------------
// PATCH REQUESTS
// ----------------------

export async function UpdateListInfoRequest( data: {
    boardId: number,
    listId: number,
    listInfo: ChangeListInfo
}) {
    const subUrl = boardRoute + `/${data.boardId}/lists/${data.listId}`;
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify(data.listInfo),
    };

    try {
        const response = await ApiFetchRequest(subUrl, request);

        if (response.ok) {
            const data = await response.json();
            const validData = ChangeListInfoSchema.safeParse(data);

            if (validData.success) {
                return ApiRequestSuccessfull(validData.data);
            } else {
                console.error('Invalid data received from API');
                console.error(validData.error);
                return ApiRequestFailed('DataValidationFailed');
            }
        } else {
            return ApiErrorFromStatusCode(response.status);
        }
    } catch (error) {
        console.error('Error: ', error);
        return ApiRequestFailed('FetchRequestFailed');
    }
}


// ----------------------
// PUT REQUESTS
// ----------------------

export async function UpdateListOrderRequest( data: {
    boardId: number,
    listIDsInOrder: number[],
}) {
    const subUrl = boardRoute + `/${data.boardId}/lists/re-order`;
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({
            ListIDsInOrder: data.listIDsInOrder,
        }),
    };

    try {
        const response = await ApiFetchRequest(subUrl, request);

        if (response.ok) {
            return ApiRequestSuccessfull();
        } else {
            return ApiErrorFromStatusCode(response.status);
        }
    } catch (error) {
        console.error('Error: ', error);
        return ApiRequestFailed('FetchRequestFailed');
    }
}


// ----------------------
// DELETE REQUESTS
// ----------------------

export async function DeleteListRequest(data: {
    boardId: number,
    listId: number
}) {
    const subUrl = boardRoute + `/${data.boardId}/lists/${data.listId}`;
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
    } catch (error) {
        console.error('Error: ', error);
        return ApiRequestFailed('FetchRequestFailed');
    }
}