import { create } from 'zustand';
import { panelType } from '../Types/UIState';


type State = {
    activePanel: panelType; 
}

type Action = {
    setActivePanel: (newPanel: panelType) => void; 
}

export const useBoardUIStore = create<State & Action>((set) => ({
    activePanel: 'none', 
    setActivePanel: (newPanel) => {
        set(() => ({ activePanel: newPanel }))
    },
}))


