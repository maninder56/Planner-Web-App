;
import { ApiError, ApiResult } from "@/Types/ApiTypes";
import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from "@/Utilities/ApiUtilities";



const apiUrl = process.env.NEXT_PUBLIC_APIURL; 


export async function ApiFetchRequest(
    subUrl: string, 
    request: RequestInit,
) {
    return await fetch(apiUrl + subUrl, request); 
}




// R: Response Data 
// D: data for request function
export async function ApiRequestWithRefreshTokenAttempt<R, D>(
    request: (data?: D) => Promise<ApiResult<R, ApiError>>, 
    data?: D,
) {
    const firstResponse = await request(data); 

    if (firstResponse.ok || firstResponse.error !== 'Unauthorized') {
        return firstResponse; 
    }

    // Make refresh token request
    const refreshResponse = await RefreshTokensRequest(); 

    if (refreshResponse.ok) {
        return await request(data); 
    } else {
        return refreshResponse; 
    }
}

export async function  RefreshTokensRequest() {
    const subUrl = 'token/refresh';
    const request: RequestInit = {
        method: 'POST', 
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
        console.error('Error occured: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}


