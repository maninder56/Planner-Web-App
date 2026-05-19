import { create } from "zustand";
import { InvitationsInfo } from "../Types/invitationTypes";


type State = {
    invitations: InvitationsInfo; 
    loadingInvitations: boolean; 
}

type Action = {
    setInvitations: (invitations: InvitationsInfo) => void; 

    acceptInvitation: (id: number) => void; 
    rejectInvitation: (id: number) => void; 

    setLoadingInvitation: (loading: boolean) => void; 
}

export const useInvitationStore = create<State & Action>((set) => ({
    invitations: [], 
    loadingInvitations: false,

    setInvitations: (invitations) => set({invitations: invitations }),

    acceptInvitation: (id) => set((state) => ({
        invitations: state.invitations.map(invitation => {
            if (invitation.id === id) {
                return { ...invitation, status: 'Accepted'}
            } else {
                return invitation; 
            }
        })
    })), 


    rejectInvitation: (id) => set((state) => ({
        invitations: state.invitations.map(invitation => {
            if (invitation.id === id) {
                return { ...invitation, status: 'Rejected'}
            } else {
                return invitation; 
            }
        })
    })),

    setLoadingInvitation: (loading) => set({ loadingInvitations: loading }),
})); 