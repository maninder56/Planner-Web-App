import { create } from "zustand";
import { InvitationInfo, InvitationsInfo, InvitationStatus } from "../Types/invitationTypes";


type State = {
    invitations: InvitationsInfo | null; 
    loadingInvitations: boolean; 
    stale: boolean; 

    showInvitationReceivedNotification: boolean; 
}

type Action = {
    setInvitationsToNull: () => void; 
    setInvitations: (invitations: InvitationsInfo | null) => void; 
    setInvitationStatus: (id: number, status: InvitationStatus) => void; 
    setLoadingInvitation: (loading: boolean) => void; 
    addInvitation: (invitation: InvitationInfo) => void; 

    setStale: (stale: boolean) => void; 

    newInvitationReceived: () => void; 
}

export const useInvitationStore = create<State & Action>((set) => ({
    invitations: null, 
    loadingInvitations: true,
    stale: false, 
    showInvitationReceivedNotification: false, 

    setInvitationsToNull: () => set({ invitations: null }),

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

    addInvitation: (invitation) => set((state) => {
        if (state.invitations === null) {
            return state; 
        }

        return {
            invitations: [...state.invitations, invitation],
        }
    }),

    setStale: (stale) => set({ stale: stale }), 

    newInvitationReceived: () => set((state) => { 
        return state; 
    })

})); 