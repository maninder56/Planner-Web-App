import { create } from "zustand";
import { InvitationsInfo } from "../Types/invitationTypes";


type State = {
    invitations: InvitationsInfo | null; 
    loadingInvitations: boolean; 
}

type Action = {
    setInvitations: (invitations: InvitationsInfo | null) => void; 

    acceptInvitation: (id: number) => void; 
    rejectInvitation: (id: number) => void; 

    setLoadingInvitation: (loading: boolean) => void; 
}

export const useInvitationStore = create<State & Action>((set) => ({
    invitations: null, 
    loadingInvitations: true,

    setInvitations: (invitations) => set({invitations: invitations }),

    acceptInvitation: (id) => set((state) => {
        if (state.invitations === null) {
            return state; 
        } 
        
        return {
            invitations: state.invitations.map(invitation => {
                if (invitation.id === id) {
                    return { ...invitation, status: 'Accepted'}
                } else {
                    return invitation; 
                }
            })
        }
        
    }), 


    rejectInvitation: (id) => set((state) => {
        if (state.invitations === null) {
            return state; 
        }

        return {
            invitations: state.invitations.map(invitation => {
                if (invitation.id === id) {
                    return { ...invitation, status: 'Rejected'}
                } else {
                    return invitation; 
                }
            })
        }
    }),

    setLoadingInvitation: (loading) => set({ loadingInvitations: loading }),

})); 