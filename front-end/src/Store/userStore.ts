import { UserProfile } from "@/Types/userTypes";
import { create } from "zustand";

import { GetRandomUserProfileColour, profileColour } from "@/Utilities/user";



type State = {
    sessionExpired: boolean; 
    userData?: UserProfile; 
    profileIconColour: profileColour; 
}

type Action = {
    setSessionExpired: (expired: boolean) => void; 
    setUserData: (data?: UserProfile) => void; 
}

export const useUserStore = create<State & Action>((set) => ({
    sessionExpired: false, 
    userData: undefined,
    profileIconColour: GetRandomUserProfileColour(3),
  
    setSessionExpired: (expired) => set(() => ({
        sessionExpired: expired,
    })),
    
    setUserData: (data) => set(() => ({ 
        userData: data 
    })), 
})); 