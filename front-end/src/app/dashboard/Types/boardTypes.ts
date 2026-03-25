import * as z from 'zod'; 

const BoardColour = z.literal(['soft-pink', 'light-mint-green', 'aqua', 'lavender-blue', 'light-purple', 'bright-pink']); 
export type BoardColour = z.infer<typeof BoardColour>; 

const UserRole = z.literal(['Owner', 'Member', 'Viewer']);
export type UserRole = z.infer<typeof UserRole>; 

const CardPriority = z.literal(['Low', 'Medium', 'High']); 
export type CardPriority = z.infer<typeof CardPriority>; 

const CardSchema = z.object({
    id: z.number(),
    title: z.string(), 
    description: z.string(), 
    done: z.boolean(), 
    priority: CardPriority,
    dueDate: z.date(), 
    position: z.number(), 
}); 
export type Card = z.infer<typeof CardSchema>; 

const BoardListSchema = z.object({
    id: z.number(),
    title: z.string(), 
    position: z.number(), 
    cardList: z.union([z.array(CardSchema), z.undefined()]) ,
}); 
export type BoardList = z.infer<typeof BoardListSchema>; 

export const BoardSchema = z.object({
    boardId: z.number(), 
    name: z.string(),
    isFavoriteBoard: z.boolean(), 
    backgroundColour: BoardColour,
    role: UserRole,
    boardLists: z.union([z.array(BoardListSchema), z.undefined()]) ,
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
    DueDate: Date; 
    Priority: CardPriority; 
}

export type UpdateCard = {
    Title?: string; 
    Description?: string; 
    IsDone?: boolean; 
    DueDate?: Date; 
    Priority?: CardPriority; 
}

export const CardUpdatedSchema = z.object({
    CardId: z.number(), 
    Title: z.union([z.string(), z.undefined()]), 
    Description: z.union([z.string(), z.undefined()]), 
    CardPosition: z.union([z.number(), z.undefined()]), 
    IsDone: z.union([z.boolean(), z.undefined()]), 
    DueDate:z.union([z.date(), z.undefined()]), 
    Priority: z.union([CardPriority, z.undefined()]) 
}); 
export type CardUpdated = z.infer<typeof CardUpdatedSchema>; 



export const CardInfoSchema = z.object({
    CardId: z.number(), 
    Title: z.string(), 
    Description: z.union([z.string(), z.undefined()]), 
    CardPosition: z.number(), 
    IsDone: z.boolean(), 
    DueDate: z.date(), 
    Priority: CardPriority, 
    BoardListId: z.number(),
}); 
export type CardInfo = z.infer<typeof CardInfoSchema>; 


export type UpdateCardOrder = {
    ListId: number; 
    CardIDsInOrder: number[]; 
}[]; 


// {
//     "boardId": 5,
//     "name": "qqq",
//     "isFavoriteBoard": false,
//     "backgroundColour": "light-purple",
//     "role": "Owner"
// }
