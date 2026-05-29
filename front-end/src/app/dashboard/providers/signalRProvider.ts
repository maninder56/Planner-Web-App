'use client'; 

import { useEffect } from 'react';
import { useInvitationStore } from '../Store/invitationStore';
import { InvitationInfoSchema } from '../Types/invitationTypes';
import { useBoardUIStore } from '../Store/boardUIStore';
import { signalRService } from '../Services/signalRService';
import { SignalRClientMethod, SignalRServerMethod } from '../Types/signalRTypes';
import { OnlineUserLeavingSchema, OnlineUserSchema } from '../Types/boardTypes';
import { useBoardStore } from '../Store/boardStore';

export default function SignalRProvider({
    children, 
}: {
    children: React.ReactNode; 
}) {
    const addInvitation = useInvitationStore((state) => state.addInvitation); 
    const setInvitationsStale = useInvitationStore((state) => state.setStale); 
    const setShowInvitationBanner = useInvitationStore((state) => state.setShowInvitationBanner); 
    const invitationReceivedMethodName: SignalRClientMethod = 'ReceiveInvitationNotification'; 
    const userHasJoinedTheBoardMethodName: SignalRClientMethod = 'UserHasJoinedTheBoard'; 
    const userHasLeftTheBoardMethodName: SignalRClientMethod = 'UserHasLeftTheBoard'; 
    const joinBoardServerMethodName: SignalRServerMethod = 'JoinBoard'; 
    const addNewOnlineUser = useBoardStore((state) => state.addNewOnlineUser); 
    const removeOnlineUser = useBoardStore((state) => state.removeOnlineUser); 
    const currentBoardId = useBoardStore((state) => state.currentBoardData?.id); 

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
            console.error('Invalid invitation data recieved from Signal R'); 
            console.error(validData.error); 
            setInvitationsStale(true); 
        }
    }

    function UserHasJoinedTheBoard(data: any) {
        const validData = OnlineUserSchema.safeParse(data); 

        if (validData.success) {
            addNewOnlineUser(validData.data); 
        } else {
            console.error('Invalid invitation data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }


    function UserHasLeftTheBoard(data: any) {
        const validData =  OnlineUserLeavingSchema.safeParse(data); 

        if (validData.success) {
            removeOnlineUser(validData.data.userId); 
        } else {
            console.error('Invalid invitation data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }

    async function JoinBoard(boardId: number) {
        await signalRService.connection.invoke(joinBoardServerMethodName, boardId); 
    }

    useEffect(() => {
        async function init() {
            if (signalRService === null) {
                return; 
            }

            await signalRService.start(); 

            signalRService.connection.on(invitationReceivedMethodName, invitationReceived); 

            signalRService.connection.on(userHasJoinedTheBoardMethodName, UserHasJoinedTheBoard); 
            signalRService.connection.on(userHasLeftTheBoardMethodName, UserHasLeftTheBoard); 

            if (currentBoardId !== undefined) {
                JoinBoard(currentBoardId); 
            }
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