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
    cardList: z.array(CardSchema),
}); 
export type BoardList = z.infer<typeof BoardListSchema>; 

export const BoardSchema = z.object({
    id: z.number(), 
    title: z.string(),
    isFavoriteBoard: z.boolean(), 
    boardColour: BoardColour,
    role: UserRole,
    boardLists: z.array(BoardListSchema),
}); 
export type BoardDataFromAPI = z.infer<typeof BoardSchema>; 




