import * as z from 'zod'; 

const BoardColour = z.literal(['soft-pink', 'light-mint-green', 'aqua', 'lavender-blue', 'light-purple', 'bright-pink']); 
export type BoardColour = z.infer<typeof BoardColour>; 

const UserRole = z.literal(['Owner', 'Member', 'Viewer']);
export type UserRole = z.infer<typeof UserRole>; 

const CardPriority = z.literal(['Low', 'Medium', 'High']); 
export type CardPriority = z.infer<typeof CardPriority>; 

const Card = z.object({
    id: z.number(),
    title: z.string(), 
    description: z.string(), 
    done: z.boolean(), 
    priority: CardPriority,
    dueDate: z.date(), 
    position: z.number(), 
}); 
export type Card = z.infer<typeof Card>; 

const BoardList = z.object({
    id: z.number(),
    title: z.string(), 
    position: z.number(), 
    cardList: z.array(Card),
}); 
export type BoardList = z.infer<typeof BoardList>; 

const Board = z.object({
    id: z.number(), 
    title: z.string(),
    isFavoriteBoard: z.boolean(), 
    boardColour: BoardColour,
    role: UserRole,
    boardLists: z.array(BoardList),
}); 
export type BoardDataFromAPI = z.infer<typeof Board>; 




