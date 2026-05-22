import { create } from "zustand";
import { InvitationInfo, InvitationsInfo, InvitationStatus } from "../Types/invitationTypes";


type State = {
    invitations: InvitationsInfo | null; 
    loadingInvitations: boolean; 
    stale: boolean; 

    showInvitationReceivedNotification: boolean; 
    invitationReceivedNotificationTimer: NodeJS.Timeout | null; 
}

type Action = {
    setInvitationsToNull: () => void; 
    setInvitations: (invitations: InvitationsInfo | null) => void; 
    setInvitationStatus: (id: number, status: InvitationStatus) => void; 
    setLoadingInvitation: (loading: boolean) => void; 
    addInvitation: (invitation: InvitationInfo) => void; 

    setStale: (stale: boolean) => void; 

    newInvitationReceived: () => void; 
    closeInvitationReceivedNotification: () => void; 
}

export const useInvitationStore = create<State & Action>((set) => ({
    invitations: null, 
    loadingInvitations: false,
    stale: false, 
    showInvitationReceivedNotification: false, 
    invitationReceivedNotificationTimer: null, 

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

    // newInvitationReceived: () => set((state) => { 
    //     if (state.invitationReceivedNotificationTimer) {
    //         clearTimeout(state.invitationReceivedNotificationTimer); 
    //     }

    //     const timer = setTimeout(() => {
    //         set({
    //             showInvitationReceivedNotification: false,
    //             invitationReceivedNotificationTimer: null, 
    //         })
    //     }, 4000);

    //     return {
    //        showInvitationReceivedNotification: true, 
    //        invitationReceivedNotificationTimer: timer,
    //     }
    // }), 


    newInvitationReceived: () => set({ showInvitationReceivedNotification: true }), 

    // closeInvitationReceivedNotification: () => set((state) => {
    //     if (state.invitationReceivedNotificationTimer) {
    //         clearTimeout(state.invitationReceivedNotificationTimer); 
    //     }

    //     return {
    //         showInvitationReceivedNotification: false, 
    //         invitationReceivedNotificationTimer: null, 
    //     }
    // }), 

    closeInvitationReceivedNotification: () => set({ showInvitationReceivedNotification: false }), 

})); 