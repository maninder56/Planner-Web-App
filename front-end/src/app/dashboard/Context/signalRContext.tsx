import { createContext, useContext } from "react";

type SignalRContextType = {
    JoinBoard: (boardId: number) => Promise<void>; 
    LeaveBoard: (boardId: number) => Promise<void>; 
}

export const SignalRContext = createContext<SignalRContextType | null>(null); 


export function useSignalR() {
    const ctx = useContext(SignalRContext); 
    if (!ctx) throw new Error("useSignalR must be used within SignalRProvider");
    return ctx;
}


