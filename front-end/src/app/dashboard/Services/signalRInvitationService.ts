'use client'; 

import { RefreshTokensRequest } from '@/Services/ApiRequest';
import { useUserStore } from '@/Store/userStore';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

const apiUrl = process.env.NEXT_PUBLIC_APIURL; 


class SignalRInvitationService {
    public connection: HubConnection; 

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl(apiUrl + '/hubs/notifications', { withCredentials: true })
            .withAutomaticReconnect()
            .build(); 
    }

    async start() {
        const delayMs = 2000; 
        const maxAttempts = 2; 
        let attempts = 0; 
        
        while(attempts < maxAttempts) {
            if (useUserStore.getState().sessionExpired) {
                console.warn('Session expired, aborting SignalR connection.');
                return;
            }

            try {
                if (this.connection.state === HubConnectionState.Disconnected) {
                    await this.connection.start(); 
                    console.log('Signal R connected'); 
                    return; 
                } 
                return; 
            } catch(error) {
                attempts++;
                
                console.error(`SignalR start failed (attempt ${attempts})`, error);
              
                if (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }
        }

        if (attempts < maxAttempts) {
            console.error("Max connection retry attempts reached. Giving up.");
        }
    }
}

export const signalRInvitationService = new SignalRInvitationService(); 

