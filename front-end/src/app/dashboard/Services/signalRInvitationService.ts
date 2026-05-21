'use client'

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
        if (this.connection.state === HubConnectionState.Disconnected) {
            await this.connection.start(); 
            console.log('Signal R connected'); 
        } 
    }
}

export const signalRInvitationService = typeof window !== 'undefined' ? 
    new SignalRInvitationService() : null; 