import z from "zod";


export const CardSearchResultSchema = z.object({
    searchResults: z.array(z.object({
        BoardId: z.number(),
        CardId: z.number(), 
        CardName: z.string(), 
        BoardName: z.string(), 
    })), 
}); 