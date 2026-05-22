import { create } from "zustand";
import { InvitationInfo, InvitationsInfo, InvitationStatus } from "../Types/invitationTypes";


type State = {
    invitations: InvitationsInfo | null; 
    loadingInvitations: boolean; 
    stale: boolean; 

    showInvitationBanner: boolean;
}

type Action = {
    setInvitationsToNull: () => void; 
    setInvitations: (invitations: InvitationsInfo | null) => void; 
    setInvitationStatus: (id: number, status: InvitationStatus) => void; 
    setLoadingInvitation: (loading: boolean) => void; 
    addInvitation: (invitation: InvitationInfo) => void; 

    setStale: (stale: boolean) => void; 

    setShowInvitationBanner: (show: boolean) => void; 

}

export const useInvitationStore = create<State & Action>((set) => ({
    invitations: null, 
    loadingInvitations: false,
    stale: false, 
    showInvitationBanner: false, 

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
            return {
                invitations: [invitation],
            }
        }

        return {
            invitations: [invitation, ...state.invitations],
        }
    }),

    setStale: (stale) => set({ stale: stale }), 

    setShowInvitationBanner: (show) => set({ showInvitationBanner: show }), 

})); 