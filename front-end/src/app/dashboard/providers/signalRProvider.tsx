'use client'; 

import { useEffect, useRef, useState } from 'react';
import { useInvitationStore } from '../Store/invitationStore';
import { InvitationInfoSchema } from '../Types/invitationTypes';
import { useBoardUIStore } from '../Store/boardUIStore';
import { signalRService } from '../Services/signalRService';
import { SignalRClientMethod, SignalRServerMethod } from '../Types/signalRTypes';
import { AllOnlineUsersSchema, BoardInfoChangedSchema, BoardHasBeenDeletedSchema, CardHasBeenDeletedSchema, CardHasBeenUpdatedSchema, CardPositionChangedSchema, ListHasBeenDeletedSchema, ListNameUpdatedSchema, ListPositionChangedSchema, NewCardAddedSchema, NewListAddedSchema, OnlineUser, OnlineUserLeavingSchema, OnlineUserSchema } from '../Types/boardTypes';
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

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    // Board function
    const UpdateBoardInfoFromSignalR = useBoardStore((state) => state.UpdateBoardInfoFromSignalR); 
    const addNewOnlineUser = useBoardStore((state) => state.addNewOnlineUser); 
    const removeOnlineUser = useBoardStore((state) => state.removeOnlineUser); 
    const setOnlineUsers = useBoardStore((state) => state.setOnlineUsers); 
    const DeleteBoardFromSignalR = useBoardStore((state) => state.DeleteBoardFromSignalR); 

    // List functions 
    const AddNewListToBoardFromSignalR = useBoardStore((state) => state.AddNewListToBoardFromSignalR); 
    const UpdateListNameFromSignalR = useBoardStore((state) => state.UpdateListNameFromSignalR); 
    const DeleteListFromBoardFromSignalR = useBoardStore((state) => state.DeleteListFromBoardFromSignalR); 
    const UpdateListOrderFromSignalR = useBoardStore((state) => state.UpdateListOrderFromSignalR); 

    // Card functions 
    const AddNewCardFromSignalR = useBoardStore((state) => state.AddNewCardFromSignalR); 
    const DeleteCardFromListFromSignalR = useBoardStore((state) => state.DeleteCardFromListFromSignalR); 
    const UpdateCardFromSignalR = useBoardStore((state) => state.UpdateCardFromSignalR); 
    const UpdateCardOrderFromSignalR = useBoardStore((state) => state.UpdateCardOrderFromSignalR); 
 
    const currentBoardId = useBoardStore((state) => state.currentBoardData?.id); 
    const boardLoading = useBoardStore((state) => state.isBoardLoading); 

    const previousBoardIDRef = useRef<number | null>(null); 

    const invitationReceivedMethodName: SignalRClientMethod = 'ReceiveInvitationNotification'; 
    const userHasJoinedTheBoardMethodName: SignalRClientMethod = 'UserHasJoinedTheBoard'; 
    const userHasLeftTheBoardMethodName: SignalRClientMethod = 'UserHasLeftTheBoard'; 
    const CurrentOnlineUsersMethodName: SignalRClientMethod = 'CurrentOnlineUsers'; 

    // Board changes
    const BoardInfoChangedMethodName: SignalRClientMethod = 'BoardInfoChanged'; 
    const BoardHasBeenDeletedMethodName: SignalRClientMethod = 'BoardHasBeenDeleted'; 

    // list changes
    const NewListAddedMethodName: SignalRClientMethod = 'NewListAdded'; 
    const ListNameUpdatedMethodName: SignalRClientMethod = 'ListNameUpdated'; 
    const ListHasBeenDeletedMethodName: SignalRClientMethod = 'ListHasBeenDeleted'; 
    const ListPositionChangedMethodName: SignalRClientMethod = 'ListPositionChanged'; 

    // card changes 
    const NewCardAddedMethodName: SignalRClientMethod = 'NewCardAdded'; 
    const CardHasBeenDeletedMethodName: SignalRClientMethod = 'CardHasBeenDeleted'; 
    const CardHasBeenUpdatedMethodName: SignalRClientMethod = 'CardHasBeenUpdated'; 
    const CardPositionChangedMethodName: SignalRClientMethod = 'CardPositionChanged'; 

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
    function BoardInfoChanged(data: any) {
        const validData = BoardInfoChangedSchema.safeParse(data); 

        if (validData.success) {
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            UpdateBoardInfoFromSignalR(validData.data, userName); 
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
            console.error('Invalid new list data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }

    function ListNameUpdated(data: any) {
        const validData = ListNameUpdatedSchema.safeParse(data); 

        if (validData.success) {
            let message = `List renamed`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }

            UpdateListNameFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid list name data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }

    function NewCardAdded(data: any) {
        const validData = NewCardAddedSchema.safeParse(data); 

        if (validData.success) {
            let message = `New card added`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }

            AddNewCardFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid new card data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }

    function CardHasBeenDeleted(data: any) {
        const validData = CardHasBeenDeletedSchema.safeParse(data); 

        if (validData.success) {
            let message = `Card removed`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }
            setActivePanel('none'); 
            DeleteCardFromListFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid deleted card data recieved from Signal R'); 
            console.error(validData.error); 
        }
    }

    function ListHasBeenDeleted(data: any) {
        const validData = ListHasBeenDeletedSchema.safeParse(data); 

        if (validData.success) {
            let message = `List removed`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }
            setActivePanel('none'); 
            DeleteListFromBoardFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid deleted list data recieved from Signal R'); 
            console.error(validData.error); 
        }   
    }

    function BoardHasBeenDeleted(data: any) {
        const validData = BoardHasBeenDeletedSchema.safeParse(data); 

        if (validData.success) {
            let message = `Board removed`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }
            setActivePanel('none'); 
            DeleteBoardFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid deleted board data recieved from Signal R'); 
            console.error(validData.error); 
        }   
    }

    function CardHasBeenUpdated(data: any) {
        const validData = CardHasBeenUpdatedSchema.safeParse(data); 

        if (validData.success) {
            let message = `Card Edited`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }
            setActivePanel('none'); 
            UpdateCardFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid updated card data recieved from Signal R'); 
            console.error(validData.error); 
        }   
    }

    function ListPositionChanged(data: any) {
        const validData = ListPositionChangedSchema.safeParse(data); 

        if (validData.success) {
            let message = `List moved`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }
            UpdateListOrderFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid new list position data recieved from Signal R'); 
            console.error(validData.error); 
        }   
    }


    function CardPositionChanged(data: any) {
        const validData = CardPositionChangedSchema.safeParse(data); 

        if (validData.success) {
            let message = `Card moved`
            const userName = GetOnlineUser(validData.data.byUserId)?.name; 
            if (userName) {
                message += ` by ${userName}`; 
            }
            UpdateCardOrderFromSignalR(validData.data, message); 
        } else {
            console.error('Invalid new card position data recieved from Signal R'); 
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

            signalRService.connection.on(BoardInfoChangedMethodName, BoardInfoChanged); 
            signalRService.connection.on(BoardHasBeenDeletedMethodName, BoardHasBeenDeleted); 

            signalRService.connection.on(NewListAddedMethodName, NewListAdded);
            signalRService.connection.on(ListNameUpdatedMethodName, ListNameUpdated); 
            signalRService.connection.on(ListHasBeenDeletedMethodName, ListHasBeenDeleted); 
            signalRService.connection.on(ListPositionChangedMethodName, ListPositionChanged); 

            signalRService.connection.on(NewCardAddedMethodName, NewCardAdded); 
            signalRService.connection.on(CardHasBeenDeletedMethodName, CardHasBeenDeleted); 
            signalRService.connection.on(CardHasBeenUpdatedMethodName, CardHasBeenUpdated); 
            signalRService.connection.on(CardPositionChangedMethodName, CardPositionChanged); 

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

            signalRService.connection.off(BoardInfoChangedMethodName); 
            signalRService.connection.off(BoardHasBeenDeletedMethodName); 

            signalRService.connection.off(NewListAddedMethodName); 
            signalRService.connection.off(ListNameUpdatedMethodName); 
            signalRService.connection.off(ListHasBeenDeletedMethodName); 
            signalRService.connection.off(ListPositionChangedMethodName);

            signalRService.connection.off(NewCardAddedMethodName); 
            signalRService.connection.off(CardHasBeenDeletedMethodName); 
            signalRService.connection.off(CardHasBeenUpdatedMethodName); 
            signalRService.connection.off(CardPositionChangedMethodName); 
        }
    }, []); 

    return (
        <SignalRContext value={{JoinBoard, LeaveBoard}}>
            {children}
        </SignalRContext>
    ); 
           
    
}