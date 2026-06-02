'use client'; 

import { useEffect, useRef, useState } from 'react';
import { useInvitationStore } from '../Store/invitationStore';
import { InvitationInfoSchema } from '../Types/invitationTypes';
import { useBoardUIStore } from '../Store/boardUIStore';
import { signalRService } from '../Services/signalRService';
import { SignalRClientMethod, SignalRServerMethod } from '../Types/signalRTypes';
import { AllOnlineUsersSchema, OnlineUser, OnlineUserLeavingSchema, OnlineUserSchema } from '../Types/boardTypes';
import { useBoardStore } from '../Store/boardStore';
import { HubConnectionState } from '@microsoft/signalr';
import { SignalRContext } from '../Context/signalRContext';

export default function SignalRProvider({
    children, 
}: {
    children: React.ReactNode; 
}) {
    const addInvitation = useInvitationStore((state) => state.addInvitation); 
    const setInvitationsStale = useInvitationStore((state) => state.setStale); 
    const setShowInvitationBanner = useInvitationStore((state) => state.setShowInvitationBanner); 

    const addNewOnlineUser = useBoardStore((state) => state.addNewOnlineUser); 
    const removeOnlineUser = useBoardStore((state) => state.removeOnlineUser); 
    const setOnlineUsers = useBoardStore((state) => state.setOnlineUsers); 

    const currentBoardId = useBoardStore((state) => state.currentBoardData?.id); 
    const boardLoading = useBoardStore((state) => state.isBoardLoading); 

    const previousBoardIDRef = useRef<number | null>(null); 

    const invitationReceivedMethodName: SignalRClientMethod = 'ReceiveInvitationNotification'; 
    const userHasJoinedTheBoardMethodName: SignalRClientMethod = 'UserHasJoinedTheBoard'; 
    const userHasLeftTheBoardMethodName: SignalRClientMethod = 'UserHasLeftTheBoard'; 
    const CurrentOnlineUsersMethodName: SignalRClientMethod = 'CurrentOnlineUsers'; 

    const joinBoardServerMethodName: SignalRServerMethod = 'JoinBoard'; 
    const leaveBoardServerMethodName: SignalRServerMethod = 'LeaveBoard'; 

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
            console.error('Invalid user joining the board data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }


    function UserHasLeftTheBoard(data: any) {
        const validData =  OnlineUserLeavingSchema.safeParse(data); 

        if (validData.success) {
            removeOnlineUser(validData.data.userId); 
        } else {
            console.error('Invalid user leaving the board  data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }

    function CurrentOnlineUsers(data: any) {
        const validData = AllOnlineUsersSchema.safeParse(data); 

        if (validData.success) {
            setOnlineUsers(validData.data); 
        } else {
            console.error('Invalid online users data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }

    async function JoinBoard(boardId: number) {
        await signalRService.connection.invoke(joinBoardServerMethodName, boardId); 
    }

    async function LeaveBoard(boardId: number) {
        await signalRService.connection.invoke(leaveBoardServerMethodName, boardId); 
    }

    async function tryJoinAndLeaveBoard() {
        const connectionReady = signalRService.connection.state === HubConnectionState.Connected; 

        const currentBoardIdLatest = useBoardStore.getState().currentBoardData?.id; 
        const boardLoadingLatest = useBoardStore.getState().isBoardLoading; 
        const previousBoardId = previousBoardIDRef.current; 

        if (!connectionReady) return;
        if (boardLoadingLatest) return; 
        if (currentBoardIdLatest === previousBoardId) return; 

        if (previousBoardId !== null) {
            await LeaveBoard(previousBoardId); 
        }

        if (currentBoardIdLatest !== undefined) {
            await JoinBoard(currentBoardIdLatest); 
            previousBoardIDRef.current = currentBoardIdLatest; 
        }
    }


    useEffect(() => {
        tryJoinAndLeaveBoard(); 
    }, [boardLoading, currentBoardId]); 

    useEffect(() => {
        async function init() {
            if (signalRService === null) {
                return; 
            }

            signalRService.connection.on(invitationReceivedMethodName, invitationReceived); 

            signalRService.connection.on(userHasJoinedTheBoardMethodName, UserHasJoinedTheBoard); 
            signalRService.connection.on(userHasLeftTheBoardMethodName, UserHasLeftTheBoard); 
            signalRService.connection.on(CurrentOnlineUsersMethodName, CurrentOnlineUsers); 

            await signalRService.start(); 
            tryJoinAndLeaveBoard(); 
        }

        init(); 

        return () => {
            if (signalRService === null) {
                return; 
            }
            
            signalRService.connection.off(invitationReceivedMethodName);
            signalRService.connection.off(userHasJoinedTheBoardMethodName);
            signalRService.connection.off(userHasLeftTheBoardMethodName);
            signalRService.connection.off(CurrentOnlineUsersMethodName);
        }
    }, []); 

    return (
        <SignalRContext value={{JoinBoard, LeaveBoard}}>
            {children}
        </SignalRContext>
    ); 
           
    
}