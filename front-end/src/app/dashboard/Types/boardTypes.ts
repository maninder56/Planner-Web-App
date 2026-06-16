import * as z from 'zod'; 

const BoardColourSchema = z.enum(['soft-pink', 'light-mint-green', 'aqua', 'lavender-blue', 'light-purple', 'bright-pink']); 
export type BoardColour = z.infer<typeof BoardColourSchema>; 

export const UserRoleSchema = z.enum([
  "Owner",
  "Member",
  "Viewer",
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const CardPrioritySchema = z.enum([
  "Low",
  "Medium",
  "High",
]);

export type CardPriority = z.infer<typeof CardPrioritySchema>;

const CardSchema = z.object({
    cardId: z.number(),
    title: z.string(), 
    description: z.string(), 
    isDone: z.boolean(), 
    priority: CardPrioritySchema,
    dueDate: z.string(), 
    cardPosition: z.number(), 
}); 
export type CardFromAPI = z.infer<typeof CardSchema>; 

const BoardListSchema = z.object({
    boardListId: z.number(),
    name: z.string(), 
    listPosition: z.number(), 
    cardList: z.union([z.array(CardSchema), z.undefined()]) ,
}); 
export type BoardListFromAPI = z.infer<typeof BoardListSchema>; 

export const BoardSchema = z.object({
    boardId: z.number(), 
    name: z.string(),
    isFavoriteBoard: z.boolean(), 
    backgroundColour: BoardColourSchema,
    role: UserRoleSchema,
    boardList: z.union([z.array(BoardListSchema), z.undefined()]) ,
}); 
export type BoardDataFromAPI = z.infer<typeof BoardSchema>; 

export const BoardArraySchema = z.array(BoardSchema); 
export type BoardArray = z.infer<typeof BoardArraySchema>; 

export const BoardInfoSchema = z.object({
    name: z.union([z.string(), z.undefined()]),
    isFavoriteBoard: z.union([z.boolean(), z.undefined()]),
    backgroundColour: z.union([BoardColourSchema, z.undefined()]),
});
export type BoardInfo = z.infer<typeof BoardInfoSchema>; 

export type NewCard = {
    Title: string; 
    Description?: string; 
    IsDone: boolean; 
    DueDate: string; 
    Priority: CardPriority; 
}

export type UpdateCard = {
    Title?: string; 
    Description?: string; 
    IsDone?: boolean; 
    DueDate?: string; 
    Priority?: CardPriority; 
}

export const CardUpdatedSchema = z.object({
    cardId: z.number(), 
    title: z.union([z.string(), z.undefined()]), 
    description: z.union([z.string(), z.undefined()]), 
    cardPosition: z.union([z.number(), z.undefined()]), 
    isDone: z.union([z.boolean(), z.undefined()]), 
    dueDate:z.union([z.string(), z.undefined()]), 
    priority: z.union([CardPrioritySchema, z.undefined()]) 
}); 
export type CardUpdated = z.infer<typeof CardUpdatedSchema>; 



export const CardInfoSchema = z.object({
    cardId: z.number(), 
    title: z.string(), 
    description: z.union([z.string(), z.undefined()]), 
    cardPosition: z.number(), 
    isDone: z.boolean(), 
    dueDate: z.string(), 
    priority: CardPrioritySchema, 
    boardListId: z.number(),
}); 
export type CardInfo = z.infer<typeof CardInfoSchema>; 


export type UpdateCardOrder = {
    listId: number; 
    cardIDsInOrder: number[]; 
}[]; 

export const OnlineUserSchema = z.object({
    userId: z.number(), 
    name: z.string(), 
    email: z.string(), 
}); 

export type OnlineUser = z.infer<typeof OnlineUserSchema>; 

export const OnlineUserLeavingSchema = z.object({
    userId: z.number(), 
}); 

export const AllOnlineUsersSchema = z.array(OnlineUserSchema); 


export const BoardInfoChangedSchema = z.object({
    boardId: z.number(), 
    byUserId: z.number(),
    newBackgroundColour: z.union([BoardColourSchema, z.undefined()]), 
    newBoardName: z.union([z.string(), z.undefined()]), 
}); 

export type BoardInfoChangedData = z.infer<typeof BoardInfoChangedSchema>; 


export const NewListAddedSchema = z.object({
    byUserId: z.number(), 
    listId: z.number(), 
    name: z.string(), 
    listPosition: z.number(), 
    boardId: z.number(),
}); 

export type NewListAdded = z.infer<typeof NewListAddedSchema>; 


export const ListNameUpdatedSchema = z.object({
    byUserId: z.number(), 
    listId: z.number(), 
    newName: z.string(), 
    boardId: z.number(),
});

export type ListNameUpdated = z.infer<typeof ListNameUpdatedSchema>; 

export const NewCardAddedSchema = z.object({
    byUserId: z.number(),
    boardId: z.number(), 
    boardListId: z.number(), 
    cardId: z.number(), 
    title: z.string(), 
    description: z.union([z.string(), z.undefined()]), 
    isDone: z.boolean(), 
    priority: CardPrioritySchema,
    dueDate: z.string(), 
    cardPosition: z.number(), 
}); 


export type NewCardAdded = z.infer<typeof NewCardAddedSchema>; 

export const CardHasBeenDeletedSchema = z.object({
    byUserId: z.number(), 
    listId: z.number(),  
    boardId: z.number(),
    cardId: z.number(),
}); 

export type CardHasBeenDeletedData = z.infer<typeof CardHasBeenDeletedSchema>; 


export const ListHasBeenDeletedSchema = z.object({
    byUserId: z.number(), 
    listId: z.number(),  
    boardId: z.number(),
}); 

export type ListHasBeenDeletedData = z.infer<typeof ListHasBeenDeletedSchema>; 



export const BoardHasBeenDeletedSchema = z.object({
    byUserId: z.number(), 
    boardId: z.number(),
}); 

export type BoardHasBeenDeletedData = z.infer<typeof BoardHasBeenDeletedSchema>; 

export const CardHasBeenUpdatedSchema = z.object({
    byUserId: z.number(), 
    listId: z.number(),  
    boardId: z.number(),
    cardId: z.number(),

    title: z.union([z.string(), z.undefined()]), 
    description: z.union([z.string(), z.undefined()]), 
    isDone: z.union([z.boolean(), z.undefined()]), 
    dueDate:z.union([z.string(), z.undefined()]), 
    priority: z.union([CardPrioritySchema, z.undefined()]),  
}); 

export type CardHasBeenUpdatedData = z.infer<typeof CardHasBeenUpdatedSchema>; 


export const ListPositionChangedSchema = z.object({
   byUserId: z.number(),  
   boardId: z.number(),
   listOrder: z.array(z.number()), 
}); 

export type ListPositionChangedData = z.infer<typeof ListPositionChangedSchema>; 


const ListAndCardOrder = z.object({
    listId: z.number(),  
    cardIDsInOrder: z.array(z.number()), 
}); 

export const CardPositionChangedSchema = z.object({
   byUserId: z.number(),  
   boardId: z.number(),
   firstList: ListAndCardOrder, 
   secondList: z.union([ListAndCardOrder, z.undefined()]), 
}); 

export type CardPositionChangedData = z.infer<typeof CardPositionChangedSchema>; 


export const CardLockInfoSchema = z.object({
   cardId: z.number(), 
   boardId: z.number(), 
   userId: z.number(), 
   lockedAt: z.string(), 
}); 

export type CardLockInfo = z.infer<typeof CardLockInfoSchema>; 


export const CurrentlyLockedCardsSchema = z.object({
    lockedCards: z.union([z.array(CardLockInfoSchema), z.undefined()]),  
}); 

export type CurrentlyLockedCardsData = z.infer<typeof CurrentlyLockedCardsSchema>; 

