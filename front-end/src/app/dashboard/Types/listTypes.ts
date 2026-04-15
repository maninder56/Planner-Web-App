import z from "zod";

// Api response types
export const NewListResponseSchema = z.object({
    id: z.number(), 
    name: z.string(), 
    listPosition: z.number(),
}); 

export const ChangeListInfoSchema = z.object({
    name: z.union([z.string(), z.undefined()]), 
}); 

export type ChangeListInfo = z.infer<typeof ChangeListInfoSchema>; 