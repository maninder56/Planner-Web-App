
import * as SignalR from '@microsoft/signalr'; 

const apiUrl = process.env.NEXT_PUBLIC_APIURL; 

class SignalRInvitationService {
    public connection: SignalR.HubConnection; 

    constructor() {
        this.connection = new SignalR.HubConnectionBuilder()
            .withUrl(apiUrl + '/hubs/notifications', { withCredentials: true })
            .withAutomaticReconnect()
            .build(); 
    }

    async start() {
        if (this.connection.state === SignalR.HubConnectionState.Disconnected) {
            await this.connection.start(); 
            console.log('Signal R connected'); 
        } 
    }
}

export const signalRInvitationService = new SignalRInvitationService(); 