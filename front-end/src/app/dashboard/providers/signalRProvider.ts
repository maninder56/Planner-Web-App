'use client'; 

import { useEffect } from 'react';
import { useInvitationStore } from '../Store/invitationStore';
import { InvitationInfoSchema, SignalRClientMethods } from '../Types/invitationTypes';
import { useBoardUIStore } from '../Store/boardUIStore';
import { signalRService } from '../Services/signalRService';

export default function SignalRProvider({
    children, 
}: {
    children: React.ReactNode; 
}) {
    const addInvitation = useInvitationStore((state) => state.addInvitation); 
    const setInvitationsStale = useInvitationStore((state) => state.setStale); 
    const setShowInvitationBanner = useInvitationStore((state) => state.setShowInvitationBanner); 
    const invitationReceivedMethodName: SignalRClientMethods = 'ReceiveInvitationNotification'; 

    function invitationReceived(data: any) {
        const validData = InvitationInfoSchema.safeParse(data); 
        const activePanel = useBoardUIStore.getState().activePanel; 
        
        if (validData.success) {
            addInvitation(validData.data); 
            if (activePanel !== 'inboxOptionsPanel') { 
                setShowInvitationBanner(true); 
            } else {
                setShowInvitationBanner(false); 
            } 
        } else {
            console.error('Invalid data recieved from API'); 
            console.error(validData.error); 
            setInvitationsStale(true); 
        }
    }

    useEffect(() => {
        async function init() {
            if (signalRService === null) {
                return; 
            }

            await signalRService.start(); 

            signalRService.connection
                .on(invitationReceivedMethodName, invitationReceived); 
        }

        init(); 

        return () => {
            if (signalRService === null) {
                return; 
            }
            
            signalRService.connection.off(invitationReceivedMethodName); 
        }
    }, []); 

    return children; 
}