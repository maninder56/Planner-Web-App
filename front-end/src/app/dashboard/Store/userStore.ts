import { UserProfile } from "@/Types/userTypes";
import { create } from "zustand";



type State = {
    isUserDataLoading: boolean; 
    isUserAuthenticated: boolean; 
    userData?: UserProfile
}

type Action = {
    setUserDataLoading: (isLoading: boolean) => void; 
    setUserData: (data: UserProfile) => void; 
    setUserAuthenticated: (isAuthenticated: boolean) => void; 
}

export const useUserStore = create<State & Action>((set) => ({
    isUserDataLoading: true, 
    isUserAuthenticated: false, 
    userData: undefined,

    setUserDataLoading: (isLoading) => {
        set(() => ({ isUserDataLoading: isLoading }))
    },
  
    setUserData: (data) => {
        set(() => ({ userData: data }))
    },

    setUserAuthenticated: (isAuthenticated) => {
        set(() => ({ isUserAuthenticated: isAuthenticated}))
    }, 
})); 