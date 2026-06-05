'use client'; 

import { useEffect, useRef, useState } from 'react';
import { useInvitationStore } from '../Store/invitationStore';
import { InvitationInfoSchema } from '../Types/invitationTypes';
import { useBoardUIStore } from '../Store/boardUIStore';
import { signalRService } from '../Services/signalRService';
import { SignalRClientMethod, SignalRServerMethod } from '../Types/signalRTypes';
import { AllOnlineUsersSchema, BoardColourChangedSchema, NewListAddedSchema, OnlineUser, OnlineUserLeavingSchema, OnlineUserSchema } from '../Types/boardTypes';
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

    const setBoardActivityMessage = useBoardStore((state) => state.setBoardActivityMessage); 
    const addNewOnlineUser = useBoardStore((state) => state.addNewOnlineUser); 
    const removeOnlineUser = useBoardStore((state) => state.removeOnlineUser); 
    const setOnlineUsers = useBoardStore((state) => state.setOnlineUsers); 

    const updateBoardColour = useBoardStore((state) => state.updateBoardColour); 
    const AddNewListToBoardFromSignalR = useBoardStore((state) => state.AddNewListToBoardFromSignalR); 

    const onlineUsers = useBoardStore((state) => state.onlineUsers); 
    const currentBoardId = useBoardStore((state) => state.currentBoardData?.id); 
    const boardLoading = useBoardStore((state) => state.isBoardLoading); 

    const previousBoardIDRef = useRef<number | null>(null); 

    const invitationReceivedMethodName: SignalRClientMethod = 'ReceiveInvitationNotification'; 
    const userHasJoinedTheBoardMethodName: SignalRClientMethod = 'UserHasJoinedTheBoard'; 
    const userHasLeftTheBoardMethodName: SignalRClientMethod = 'UserHasLeftTheBoard'; 
    const CurrentOnlineUsersMethodName: SignalRClientMethod = 'CurrentOnlineUsers'; 

    // Board changes
    const BoardColourChangedMethodName: SignalRClientMethod = 'BoardColourChanged'; 
    const NewListAddedMethodName: SignalRClientMethod = 'NewListAdded'; 

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

    function GetOnlineUser(userId: number) {
        const user = useBoardStore.getState().onlineUsers.get(userId); 
        if (user) {
            return {...user}; 
        } else {
            return undefined; 
        }
    }

    // Board changes 
    function BoardColourChanged(data: any) {
        const validData = BoardColourChangedSchema.safeParse(data); 

        if (validData.success) {
            updateBoardColour(validData.data.newBackgroundColour, validData.data.boardId); 
            const userName = GetOnlineUser(validData.data.changedByUserId)?.name; 
            if (userName) {
                setBoardActivityMessage(`Board Colour Changed by ${userName}`); 
            } else {
                setBoardActivityMessage(`Board Colour Changed`); 
            }
        } else {
            console.error('Invalid Board data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }

    function NewListAdded(data: any) {
        const validData = NewListAddedSchema.safeParse(data); 

        if (validData.success) {
            let message = `New list added`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }

            AddNewListToBoardFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid list data recieved from Signal R'); 
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

            signalRService.connection.on(BoardColourChangedMethodName, BoardColourChanged); 
            signalRService.connection.on(NewListAddedMethodName, NewListAdded); 

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

            signalRService.connection.off(BoardColourChangedMethodName); 
            signalRService.connection.off(NewListAddedMethodName); 
        }
    }, []); 

    return (
        <SignalRContext value={{JoinBoard, LeaveBoard}}>
            {children}
        </SignalRContext>
    ); 
           
    
}