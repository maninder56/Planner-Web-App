import { UserProfile } from "@/Types/userTypes";
import { create } from "zustand";
import { profileColour } from "../Types/UIState";



type State = {
    isUserDataLoading: boolean; 
    userData?: UserProfile
    profileIconColour: profileColour; 
}

type Action = {
    setUserDataLoading: (isLoading: boolean) => void; 
    setUserData: (data: UserProfile) => void; 
}

export const useUserStore = create<State & Action>((set) => ({
    isUserDataLoading: true, 
    userData: undefined,
    profileIconColour: 'red', // create function later to get random colour

    setUserDataLoading: (isLoading) => {
        set(() => ({ isUserDataLoading: isLoading }))
    },
  
    setUserData: (data) => {
        set(() => ({ userData: data }))
    }, 
})); 