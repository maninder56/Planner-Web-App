import { create } from 'zustand';
import { panelType } from '../Types/UIState';


type State = {
    activePanel: panelType; 
    switchBoardOptionsErrorMessage?: string; 
}

type Action = {
    setActivePanel: (newPanel: panelType) => void; 
    setSwitchBoardOptionsErrorMessage: (message?: string) => void; 
}

export const useBoardUIStore = create<State & Action>((set) => ({
    activePanel: 'none', 
    switchBoardOptionsErrorMessage: undefined, 

    setActivePanel: (newPanel) => set(() => ({ 
        activePanel: newPanel 
    })),

    setSwitchBoardOptionsErrorMessage: (message) => set(() => ({
        switchBoardOptionsErrorMessage: message,
    })), 
}))


