import * as z from 'zod'; 
import { UserRoleSchema } from './boardTypes';

 

export const InvitationStatusSchema = z.enum([
  "Pending",
  "Accepted",
  "Rejected",
  "Revoked",
  "Expired",
  "Invalidated",
]);

export type InvitationStatus = z.infer<typeof InvitationStatusSchema>; 

const InvitationRespondStatusSchema = z.enum(["Accepted", "Rejected"]); 
export type InvitationRespondStatus = z.infer<typeof InvitationRespondStatusSchema>; 


export const InvitationInfoSchema = z.object({
  id: z.number(),
  boardId: z.number(),
  boardName: z.string(),
  invitedByUserEmail: z.string(),
  role: UserRoleSchema,
  status: InvitationStatusSchema,
  expiresAt: z.string(),
})

export type InvitationInfo = z.infer<typeof InvitationInfoSchema>; 


export const InvitationsInfoSchema = z.array(
  InvitationInfoSchema
);

export type InvitationsInfo = z.infer<typeof InvitationsInfoSchema>; 



const SendInvitationSchema = z.object({
    boardId: z.number(), 
    invitedUserEmail: z.string(), 
    role: UserRoleSchema,
}); 

export type SendInvitation = z.infer<typeof SendInvitationSchema>; 

