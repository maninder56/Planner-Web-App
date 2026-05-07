import * as z from 'zod'; 

const BoardColour = z.literal(['soft-pink', 'light-mint-green', 'aqua', 'lavender-blue', 'light-purple', 'bright-pink']); 
export type BoardColour = z.infer<typeof BoardColour>; 

const UserRole = z.literal(['Owner', 'Member', 'Viewer']);
export type UserRole = z.infer<typeof UserRole>; 

const CardPriority = z.literal(['Low', 'Medium', 'High']); 
export type CardPriority = z.infer<typeof CardPriority>; 

const CardSchema = z.object({
    cardId: z.number(),
    title: z.string(), 
    description: z.string(), 
    isDone: z.boolean(), 
    priority: CardPriority,
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
    backgroundColour: BoardColour,
    role: UserRole,
    boardList: z.union([z.array(BoardListSchema), z.undefined()]) ,
}); 
export type BoardDataFromAPI = z.infer<typeof BoardSchema>; 

export const BoardArraySchema = z.array(BoardSchema); 
export type BoardArray = z.infer<typeof BoardArraySchema>; 

export const BoardInfoSchema = z.object({
    name: z.union([z.string(), z.undefined()]),
    isFavoriteBoard: z.union([z.boolean(), z.undefined()]),
    backgroundColour: z.union([BoardColour, z.undefined()]),
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
    priority: z.union([CardPriority, z.undefined()]) 
}); 
export type CardUpdated = z.infer<typeof CardUpdatedSchema>; 



export const CardInfoSchema = z.object({
    cardId: z.number(), 
    title: z.string(), 
    description: z.union([z.string(), z.undefined()]), 
    cardPosition: z.number(), 
    isDone: z.boolean(), 
    dueDate: z.string(), 
    priority: CardPriority, 
    boardListId: z.number(),
}); 
export type CardInfo = z.infer<typeof CardInfoSchema>; 


export type UpdateCardOrder = {
    listId: number; 
    cardIDsInOrder: number[]; 
}[]; 


// {
//     "boardId": 5,
//     "name": "qqq",
//     "isFavoriteBoard": false,
//     "backgroundColour": "light-purple",
//     "role": "Owner"
// }
