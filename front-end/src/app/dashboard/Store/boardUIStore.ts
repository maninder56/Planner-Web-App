import { create } from 'zustand';
import { panelType } from '../Types/UIState';
import { Card, CardId, ListId } from './boardStore';
import { matchFilter } from '../Utilities/boardData';


export type ToggleFilters = {
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

const initialFilters: ToggleFilters = {
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
    searchFilter: string; 
    toggleFilters: ToggleFilters; 
}

type Action = {
    setActivePanel: (newPanel: panelType) => void; 
    setSwitchBoardOptionsErrorMessage: (message?: string) => void; 

    // Filters
    setSearchFilter: (value: string) => void; 
    toggleFilter: (filter: keyof ToggleFilters) => void; 
    resetFilters: () => void; 
    applyFilters: (cards: Record<CardId, Card>) => void; 
    applySearchFilter: (cards: Record<CardId, Card>) => void; 
}

export const useBoardUIStore = create<State & Action>((set) => ({
    activePanel: 'none', 
    switchBoardOptionsErrorMessage: undefined, 
    hiddenCardsAndLists: {
        hiddenCards: new Set([]), 
        hiddenLists: new Set([]),
    }, 
    searchFilter: '',
    toggleFilters: {
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

    setSearchFilter: (value) => set({ searchFilter: value }), 

    toggleFilter: (filter) => set((state) => {
        const exclusiveGroups: Record<string, string[]> = {
            cardStatus: ['cardStatusCompleted', 'cardStatusNotCompleted'],
            due: ['dueTomorrow', 'dueThisWeek', 'dueThisMonth'], 
        }; 

        const currentValue = state.toggleFilters[filter]; 
        let updatedFilters = { ...state.toggleFilters, [filter]: !currentValue };
        
        for (const group of Object.values(exclusiveGroups)) {
            if (group.includes(filter)) {
                group.forEach(key => {
                    if (key !== filter) {
                        updatedFilters[key as keyof ToggleFilters] = false; 
                    }
                })
            }
        }

        return {
            toggleFilters: updatedFilters, 
        }
    }), 

    resetFilters: () => set({ toggleFilters: initialFilters }), 

    applyFilters: (cards) => set((state) => {
        const hiddenCards = new Set<CardId>(); 
        const hiddenLists = new Set<ListId>(); 

        // If no filters are active, show everything
        const activeFilters = Object.entries(state.toggleFilters).filter(([_, value]) => value === true);
        if (activeFilters.length === 0) {
            return {
                hiddenCardsAndLists: {
                    hiddenCards: hiddenCards, 
                    hiddenLists: hiddenLists,
                }
            }; 
        }

        for (const [cardId, card] of Object.entries(cards)) {
            if (!matchFilter(card, state.toggleFilters)) {
                hiddenCards.add(cardId as CardId); 
            }
        }

        return {
            hiddenCardsAndLists: {
                hiddenCards: hiddenCards, 
                hiddenLists: hiddenLists,
            }
        }; 
    }), 

    applySearchFilter: (cards) => set((state) => {
        const hiddenCards = new Set<CardId>(); 
        const hiddenLists = new Set<ListId>(); 

        // Search is empty, show everything
        const search = state.searchFilter.trim(); 
        if (search === '') {
            return {
                hiddenCardsAndLists: {
                    hiddenCards: hiddenCards, 
                    hiddenLists: hiddenLists,
                }
            }; 
        }

        for (const [cardId, card] of Object.entries(cards)) {
            if (!card.name.includes(search)) {
                hiddenCards.add(cardId as CardId); 
            }
        }

        return {
            hiddenCardsAndLists: {
                hiddenCards: hiddenCards, 
                hiddenLists: hiddenLists,
            }
        }; 
    })
}))


