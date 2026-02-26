import { panelType } from "@/app/dashboard/Types/UIState";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

// No longer used
export const ActivePanelContext = createContext<[panelType, Dispatch<SetStateAction<panelType>>] | null>(null); 

export function useActivePanel() {
    const context =  useContext(ActivePanelContext); 
    if (context === null) {
        throw new Error('Active panel state was not assigned.'); 
    } else {
        return context; 
    }
}


