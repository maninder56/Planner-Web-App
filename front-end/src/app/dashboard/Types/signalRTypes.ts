
export type SignalRServerMethod = 
    'JoinBoard'     | 
    'LeaveBoard'    |
    'LockCard'      |
    'UnlockCard'    ; 

export type SignalRClientMethod = 
    'ReceiveInvitationNotification' | 
    'UserHasJoinedTheBoard'         | 
    'UserHasLeftTheBoard'           | 
    'CurrentOnlineUsers'            |
    'BoardInfoChanged'              | 
    'NewListAdded'                  | 
    'ListNameUpdated'               | 
    'NewCardAdded'                  | 
    'CardHasBeenDeleted'            | 
    'ListHasBeenDeleted'            | 
    'BoardHasBeenDeleted'           |
    'CardHasBeenUpdated'            | 
    'ListPositionChanged'           | 
    'CardPositionChanged'           | 
    'CurrentlyLockedCards'          ; 