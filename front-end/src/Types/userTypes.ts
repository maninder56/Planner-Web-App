import { z } from 'zod'; 

export const UserProfileSchema = z.object({
    Name: z.string(), 
    Email: z.string(),
}); 

export type UserProfile = z.infer<typeof UserProfileSchema>; 

