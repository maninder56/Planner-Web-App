import { create } from 'zustand';
import { panelType } from '../Types/UIState';
import { CardId, ListId } from './boardStore';


type Filters = {
    cardStatusCompleted: boolean, 
    cardStatusNotCompleted: boolean, 
    priorityHigh: boolean, 
    priorityMedium: boolean, 
    priorityLow: boolean, 
    dueOverdue: boolean,
    dueTomorrow: boolean,
    dueThisWeek: boolean,
    dueThisMonth: boolean,
}

const initialFilters: Filters = {
    cardStatusCompleted: false,
    cardStatusNotCompleted: false,
    priorityHigh: false,
    priorityMedium: false,
    priorityLow: false,
    dueOverdue: false,
    dueTomorrow: false,
    dueThisWeek: false,
    dueThisMonth: false,
};


type HiddenListsAndCards = {
    hiddenCards: Set<CardId>; 
    hiddenLists: Set<ListId>; 
}

type State = {
    activePanel: panelType; 
    switchBoardOptionsErrorMessage?: string;

    hiddenCardsAndLists: HiddenListsAndCards;  
    filters: Filters; 
}

type Action = {
    setActivePanel: (newPanel: panelType) => void; 
    setSwitchBoardOptionsErrorMessage: (message?: string) => void; 

    // Filters
    toggleFilter: (filter: keyof Filters) => void; 
    resetFilters: () => void; 
}

export const useBoardUIStore = create<State & Action>((set) => ({
    activePanel: 'none', 
    switchBoardOptionsErrorMessage: undefined, 
    hiddenCardsAndLists: {
        hiddenCards: new Set([]), 
        hiddenLists: new Set([]),
    }, 
    filters: {
        cardStatusCompleted: false, 
        cardStatusNotCompleted: false, 
        priorityHigh: false, 
        priorityMedium: false, 
        priorityLow: false, 
        dueOverdue: false,
        dueTomorrow: false,
        dueThisWeek: false,
        dueThisMonth: false,
    }, 

    setActivePanel: (newPanel) => set(() => ({ 
        activePanel: newPanel 
    })),

    setSwitchBoardOptionsErrorMessage: (message) => set(() => ({
        switchBoardOptionsErrorMessage: message,
    })), 


    // Filter operations

    toggleFilter: (filter) => set((state) => {
        const exclusiveGroups: Record<string, string[]> = {
            cardStatus: ['cardStatusCompleted', 'cardStatusNotCompleted'],
            due: ['dueTomorrow', 'dueThisWeek', 'dueThisMonth'], 
        }; 

        const currentValue = state.filters[filter]; 
        let updatedFilters = { ...state.filters, [filter]: !currentValue };
        
        for (const group of Object.values(exclusiveGroups)) {
            if (group.includes(filter)) {
                group.forEach(key => {
                    if (key !== filter) {
                        updatedFilters[key as keyof Filters] = false; 
                    }
                })
            }
        }

        return {
            filters: updatedFilters, 
        }
    }), 

    resetFilters: () => set({ filters: initialFilters }), 
}))


