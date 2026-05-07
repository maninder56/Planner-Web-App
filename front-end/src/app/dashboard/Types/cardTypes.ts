import z from "zod";


export const CardSearchResultSchema = z.object({
    searchResults: z.array(z.object({
        boardId: z.number(),
        cardId: z.number(), 
        listId: z.number(),
        cardName: z.string(), 
        boardName: z.string(), 
        listName: z.string(), 
    })), 
}); 

export type CardSearchResult = z.infer<typeof CardSearchResultSchema>; 
