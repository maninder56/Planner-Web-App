'use client'; 

import { useEffect } from 'react';
import { useInvitationStore } from '../Store/invitationStore';
import { signalRInvitationService } from '../Services/signalRInvitationService'; 
import { InvitationInfoSchema, SignalRClientMethods } from '../Types/invitationTypes';
import { useBoardUIStore } from '../Store/boardUIStore';

export default function SignalRInvitationProvider({
    children, 
}: {
    children: React.ReactNode; 
}) {
    const addInvitation = useInvitationStore((state) => state.addInvitation); 
    const setInvitationsStale = useInvitationStore((state) => state.setStale); 
    const setShowInvitationBanner = useInvitationStore((state) => state.setShowInvitationBanner); 
    const invitationReceivedMethod: SignalRClientMethods = 'ReceiveInvitationNotification'; 

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