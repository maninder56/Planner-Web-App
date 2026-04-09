
import HoverConfirmation from '@/Components/HoverConfirmation/hoverConfirmation';
import styles from './deleteBoardDialogBox.module.css'; 
import { useState } from 'react';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { DeleteBoardRequest } from '@/app/dashboard/Services/boardService';
import { useUserStore } from '@/Store/userStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';


export default function DeleteBoardDialogBox({
    boardId, 
    onCancel, 
}: {
    boardId: number; 
    onCancel: () => void; 
}) {
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const resetBoardArray = useBoardStore((state) => state.resetBoardArray); 
    const resetCurrentBoardData = useBoardStore((state) => state.resetCurrentBoardData); 
    const setLastUsedBoardExists = useBoardStore((state) => state.setLastUsedBoardExists); 

    const [error, setError] = useState(''); 

    async function handleConfirm() {
        const request = await ApiRequestWithRefreshTokenAttemptAndData(DeleteBoardRequest, boardId); 

        if (request.ok) {
            resetCurrentBoardData(); 
            resetBoardArray(); 
            setLastUsedBoardExists(false); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
        } else {
            setError('Request failed, please try again.'); 
        }
    }

    return (
        <HoverConfirmation 
            title='Delete Board'
            message='Are you sure you want to delete this board?'
            onCancel={onCancel}
            onConfirmName='Delete'
            onConfirm={handleConfirm}
            confirmationError={error} />
    ); 
}