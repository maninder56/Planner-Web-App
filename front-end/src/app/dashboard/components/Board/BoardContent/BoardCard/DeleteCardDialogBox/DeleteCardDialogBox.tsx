import { useBoardUIStore } from "@/app/dashboard/Store/boardUIStore";
import HoverConfirmation from "@/Components/HoverConfirmation/hoverConfirmation";
import { useUserStore } from "@/Store/userStore";
import { useState } from "react";


export default function DeleteCardDialogBox({
    boardId, 
    listId, 
    cardId,
    cardTitle,
    onCancel, 
}: {
    boardId: number; 
    listId: number;
    cardId: number;
    cardTitle: string; 
    onCancel: () => void; 
}) {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    // const deleteCard = 

    const [error, setError] = useState(''); 
    
    async function handleConfirm() {
        
    }

    return (
        <HoverConfirmation
            title={`Delete card "${cardTitle}"?`}
            message='This card will be permanently deleted. This action cannot be undone.'
            onCancel={onCancel}
            onConfirmName='Delete Card'
            onConfirm={handleConfirm}
            confirmationError={error} />
    ); 
}