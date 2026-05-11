import { UserProfileSchema } from "@/Types/userTypes";
import { ApiFetchRequest } from "./ApiRequest";
import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from "@/Utilities/ApiUtilities";


const profileRoute = '/account/profile';
const accountRoute = '/account';  


// user account requests
export async function LogoutUserRequest() {
    const subUrl = accountRoute + '/logout'; 
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
        console.error('Error: ', error); 
        return ApiRequestFailed('FetchRequestFailed'); 
    }
}


export async function ChangeUserPasswordRequest(data: {oldPassword: string, newPassword: string}) {
    const subUrl = accountRoute + '/password'; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'PATCH', 
        credentials: 'include',
        body: JSON.stringify({
            OldPassword: data.oldPassword, 
            NewPassword: data.newPassword,
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


export async function ForgotPasswordRequest(email: string) {
    const subUrl = accountRoute + '/forgot-password'; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'POST', 
        body: JSON.stringify({
            email: email, 
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


export async function ResetPasswordRequest(data: {
    email: string, 
    token: string, 
    newPassword: string, 
}) {
    const subUrl = accountRoute + '/reset-password'; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'POST', 
        body: JSON.stringify({
            email: data.email, 
            token: data.token, 
            newPassword: data.newPassword, 
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






// User profile requests
export async function UserProfileDataRequest() {
    const subUrl = profileRoute; 
    const request: RequestInit = {
        method: 'GET', 
        credentials: 'include',
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = UserProfileSchema.safeParse(data); 

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



export async function UpdateUserNameRequest(newName: string) {
    const subUrl = profileRoute; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'PATCH', 
        credentials: 'include',
        body: JSON.stringify({
            Name: newName, 
        })
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


export async function DeleteUserProfileRequest() {
    const subUrl = profileRoute; 
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
