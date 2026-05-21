'use client'

import { useEffect } from 'react';
import { useInvitationStore } from '../Store/invitationStore';
import { signalRInvitationService } from '../Services/signalRInvitationService'; 
import { InvitationInfoSchema, SignalRClientMethods } from '../Types/invitationTypes';

export default function SignalRInvitationProvider({
    children, 
}: {
    children: React.ReactNode; 
}) {
    const addInvitation = useInvitationStore((state) => state.addInvitation); 
    const invitationReceivedMethod: SignalRClientMethods = 'ReceiveInvitationNotification'; 

    function invitationReceived(data: any) {
        const validData = InvitationInfoSchema.safeParse(data); 
        
        if (validData.success) {
            addInvitation(validData.data); 
            // show invitation method with data
            console.log('user got notification'); 
        } else {
            console.error('Invalid data recieved from API'); 
            console.error(validData.error); 
            console.error(`data received: \n${JSON.stringify(data)}`); 
            //either set the invitations to null or refetch data here
        }
    }

    useEffect(() => {
        async function init() {
            if (signalRInvitationService === null) {
                return; 
            }

            await signalRInvitationService.start(); 

            signalRInvitationService.connection
                .on(invitationReceivedMethod, invitationReceived); 
        }

        init(); 

        return () => {
            if (signalRInvitationService === null) {
                return; 
            }
            
            signalRInvitationService.connection.off(invitationReceivedMethod); 
        }
    }, []); 

    return children; 
}