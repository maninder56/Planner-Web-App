import { ApiFetchRequest } from "@/Services/ApiRequest";
import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from "@/Utilities/ApiUtilities";

const accountRoute = '/account'; 

export async function LogInUserRequest(
    userData: { email: string; password: string; },
) {
    const subUrl = accountRoute + '/login'; 
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
        const response = await ApiFetchRequest(subUrl, request); 

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
    userData: { name: string; email: string; password: string; }
) {
    const subUrl = accountRoute + '/create'; 
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
        const response = await ApiFetchRequest(subUrl, request); 

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