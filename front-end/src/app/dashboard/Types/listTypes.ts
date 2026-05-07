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

export const ListOrderSchema = z.object({
    listOrder: z.array(z.number()), 
}); 

export type ChangeListInfo = z.infer<typeof ChangeListInfoSchema>; 