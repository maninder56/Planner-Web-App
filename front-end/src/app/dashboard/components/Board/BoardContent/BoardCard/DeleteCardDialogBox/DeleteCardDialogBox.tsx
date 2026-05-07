import { DeleteCardRequest } from "@/app/dashboard/Services/cardService";
import { CardId, ListId, useBoardStore } from "@/app/dashboard/Store/boardStore";
import { useBoardUIStore } from "@/app/dashboard/Store/boardUIStore";
import HoverConfirmation from "@/Components/HoverConfirmation/hoverConfirmation";
import { ApiRequestWithRefreshTokenAttemptAndData } from "@/Services/ApiRequest";
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
    const deleteCard = useBoardStore((state) => state.deleteCard); 

    const [error, setError] = useState(''); 
    
    async function handleConfirm() {
        const request = await ApiRequestWithRefreshTokenAttemptAndData(DeleteCardRequest, {
            boardId: boardId,
            listId: listId,
            cardId: cardId,
        }); 

        if (request.ok) {
            deleteCard(listId, cardId); 
            setActivePanel('none'); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
        } else {
            setError('Failed to Delete card, please try again.'); 
        }
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