import { create } from "zustand";
import { InvitationsInfo, InvitationStatus } from "../Types/invitationTypes";


type State = {
    invitations: InvitationsInfo | null; 
    loadingInvitations: boolean; 
}

type Action = {
    setInvitations: (invitations: InvitationsInfo | null) => void; 

    setInvitationStatus: (id: number, status: InvitationStatus) => void; 

    setLoadingInvitation: (loading: boolean) => void; 
}

export const useInvitationStore = create<State & Action>((set) => ({
    invitations: null, 
    loadingInvitations: true,

    setInvitations: (invitations) => set({invitations: invitations }),

    setInvitationStatus: (id, status) => set((state) => {
        if (state.invitations === null) {
            return state; 
        }

        return {
            invitations: state.invitations.map(invitation => {
                if (invitation.id === id) {
                    return { ...invitation, status: status }
                } else {
                    return invitation; 
                }
            })
        }
    }),

    setLoadingInvitation: (loading) => set({ loadingInvitations: loading }),

})); 