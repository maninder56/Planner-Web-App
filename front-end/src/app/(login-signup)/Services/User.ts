import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from "@/Utilities/ApiUtilities";


export async function LogInUserRequest(
    apiUrl: string, 
    userData: { email: string; password: string; },
) {
    const url = apiUrl + '/account/login'; 
    const request: RequestInit = { 
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST', 
        credentials: 'include',
        body: JSON.stringify({
            Email: userData.email, 
            Password: userData.password
        })
    };

    try {

        const response = await fetch(url, request); 

        if (response.ok) {
            return ApiRequestSuccessfull(undefined); 
        } else {
            return ApiErrorFromStatusCode(response.status); 
        }

    } catch (error) {
        console.error('Error occured while requesting to Log user in: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}

export async function SignupUserRequest(
    apiUrl: string, 
    userData: { name: string; email: string; password: string; }
) {
    const url = apiUrl + '/account/create'; 
    const request: RequestInit = { 
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST', 
        credentials: 'include',
        body: JSON.stringify({
            Name: userData.name, 
            Email: userData.email, 
            Password: userData.password
        })
    };

    try {

        const response = await fetch(url, request); 

        if (response.ok) {
            return ApiRequestSuccessfull(undefined); 
        } else {
            return ApiErrorFromStatusCode(response.status); 
        }

    } catch (error) {
        console.error('Error occured while requesting to new account: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}