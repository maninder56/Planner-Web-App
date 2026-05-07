
import HoverConfirmation from '@/Components/HoverConfirmation/hoverConfirmation';
import { ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useUserStore } from '@/Store/userStore';
import { useState } from 'react';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { DeleteListRequest } from '@/app/dashboard/Services/listService';
import { ConvertListIdToNumeric } from '@/app/dashboard/Utilities/listUtilities';

export default function DeleteListDialogBox({
    boardId, 
    listId
}: {
    boardId: number; 
    listId: ListId; 
}) {
    const listIdInNumber = ConvertListIdToNumeric(listId); 
    const listName = useBoardStore((state) => state.lists[listId]?.name); 
    
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const deleteList = useBoardStore((state) => state.deleteList); 

    const [error, setError] = useState(''); 

    async function handleConfirm() {
        if (!listName) {
            setError('Error occured, please try again.'); 
            return; 
        }

        const request = await ApiRequestWithRefreshTokenAttemptAndData(DeleteListRequest, {boardId: boardId, listId: listIdInNumber}); 
        if (request.ok) {
            deleteList(listId); 
            setError(''); 
            setActivePanel('none'); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
        } else {
            setError('Failed to delete list, please try again later.'); 
        }
    }

    return (
        <HoverConfirmation
            title={listName ? `Delete list "${listName}"?` : 'Delete list?'}
            message='This will permanently delete all cards in this list. This action cannot be undone.'
            onCancel={() => setActivePanel('none')}
            onConfirmName='Delete list'
            onConfirm={handleConfirm}
            confirmationError={error} />
    ); 
}