import z from "zod";

// Api response types
export const NewListResponseSchema = z.object({
    Name: z.string(), 
    ListPosition: z.number(),
}); 

export const ChangeListInfoSchema = z.object({
    Name: z.union([z.string(), z.undefined()]), 
}); 

export type ChangeListInfo = z.infer<typeof ChangeListInfoSchema>; 