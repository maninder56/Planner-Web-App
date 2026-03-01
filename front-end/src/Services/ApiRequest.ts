import { ApiError, ApiResult } from "@/Types/ApiTypes";
import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from "@/Utilities/ApiUtilities";



const apiUrl = process.env.NEXT_PUBLIC_APIURL; 



export async function ApiRequest<R, D>(
    request: (apiUrl: string, data: D) => Promise<ApiResult<R, ApiError>>, 
    data: D,
) {
     if (apiUrl === undefined) {
        console.error('Failed to load API URL'); 
        return ApiRequestFailed('ApiUrlNotFound'); 
    }

    return await request(apiUrl, data); 
} 





// R: Response Data 
// D: data for request function
export async function ApiRequestWithRefreshTokenAttempt<R, D>({
    request, 
    data,
}: {
    request: (apiUrl: string, data?: D) => Promise<ApiResult<R, ApiError>>; 
    data?: D; 
}) {
    if (apiUrl === undefined) {
        console.error('Failed to load API URL'); 
        return ApiRequestFailed('ApiUrlNotFound'); 
    }

    const firstResponse = await request(apiUrl, data); 

    if (firstResponse.ok || firstResponse.error !== 'Unauthorized') {
        return firstResponse; 
    }

    // Make refresh token request
    const refreshResponse = await RefreshTokensRequest(apiUrl); 

    if (refreshResponse.ok) {
        return await request(apiUrl, data); 
    } else {
        return refreshResponse; 
    }
}

export async function  RefreshTokensRequest(apiUrl: string) {
    
    const url = apiUrl + 'token/refresh';
    const request: RequestInit = {
        method: 'POST', 
        credentials: 'include', 
    }; 

    try {

        const response = await fetch(url, request); 

        if (response.ok) {
            return ApiRequestSuccessfull(); 
        } else {
            return ApiErrorFromStatusCode(response.status); 
        }

    } catch(error) {
        console.error('Error occured: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}


