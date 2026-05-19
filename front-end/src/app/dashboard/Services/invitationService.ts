import { ApiFetchRequest } from "@/Services/ApiRequest";
import { InvitationRespondStatus, InvitationsInfoSchema, SendInvitation } from "../Types/invitationTypes";
import { ApiErrorFromStatusCode, ApiRequestFailed, ApiRequestSuccessfull } from "@/Utilities/ApiUtilities";


const invitationRoute = '/invitation'; 



// Get requests

export async function GetAllInvitationsReceivedRequest() {
    const subUrl = invitationRoute + '/received'; 
    const request: RequestInit = {
        method: 'GET', 
        credentials: 'include',
    }; 

    try {
        const response = await ApiFetchRequest(subUrl, request); 

        if (response.ok) {
            const data = await response.json(); 
            const validData = InvitationsInfoSchema.safeParse(data); 

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


// POST requests

export async function SendNewInvitationRequest(data: SendInvitation) {
    const subUrl = invitationRoute; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'POST', 
        credentials: 'include',
        body: JSON.stringify(data),
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



// PATCH requests

export async function RespondToInvitationRequest(data: {
    invitationId: number, 
    status: InvitationRespondStatus,
}) {
    const subUrl = invitationRoute + `/${data.invitationId}/respond`; 
    const request: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        }, 
        method: 'PATCH', 
        credentials: 'include',
        body: JSON.stringify({
            status: data.status
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


