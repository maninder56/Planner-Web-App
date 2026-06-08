
export type SignalRServerMethod = 'JoinBoard' | 'LeaveBoard'; 

export type SignalRClientMethod = 
    'ReceiveInvitationNotification' | 
    'UserHasJoinedTheBoard'         | 
    'UserHasLeftTheBoard'           | 
    'CurrentOnlineUsers'            |
    'BoardColourChanged'            | 
    'NewListAdded'                  | 
    'ListNameUpdated'               | 
    'NewCardAdded'                  | 
    'CardHasBeenDeleted'            | 
    'ListHasBeenDeleted'            | 
    'BoardHasBeenDeleted'           ; 