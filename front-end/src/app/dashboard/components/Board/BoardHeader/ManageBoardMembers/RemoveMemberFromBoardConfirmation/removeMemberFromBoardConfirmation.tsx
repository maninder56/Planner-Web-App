import { RemoveUserFromBoardRequest } from "@/app/dashboard/Services/boardService";
import { useBoardStore } from "@/app/dashboard/Store/boardStore";
import { BoardMemberData } from "@/app/dashboard/Types/boardTypes";
import HoverConfirmation from "@/Components/HoverConfirmation/hoverConfirmation";
import { ApiRequestWithRefreshTokenAttemptAndData } from "@/Services/ApiRequest";
import { useUserStore } from "@/Store/userStore";
import { useState } from "react";

export default function RemoveMemberFromBoardConfirmation({
    memberData, 
    onCancel
}: {
    memberData: BoardMemberData; 
    onCancel: () => void; 
}) {
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const currentBoardId = useBoardStore((state) => state.currentBoardData?.id); 
    const boardMembers = useBoardStore((state) => state.boardMembers); 
    const setBoardMembers = useBoardStore((state) => state.SetBoardMembers); 

    const userName = memberData.name.length > 30 
        ? `${memberData.name.slice(0, 30)}...`
        : memberData.name; 

    const [error, setError] = useState(''); 

    async function handleConfirm() {
        if (!currentBoardId) {
            return; 
        }

        const request = await ApiRequestWithRefreshTokenAttemptAndData(RemoveUserFromBoardRequest, {
            boardId: currentBoardId, userId: memberData.userId
        }); 

        if (request.ok) {
            setBoardMembers(boardMembers?.filter(user => user.userId !== memberData.userId)); 
            onCancel(); // to close dialog box
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
        } else {
            setError('Failed to remove user, please try again.'); 
        }
    }

    return (
        <HoverConfirmation 
            title='Remove User'
            message={`Are you sure you want to remove '${userName}' from board?`}
            onCancel={onCancel}
            onConfirmName='Remove'
            onConfirm={handleConfirm}
            confirmationError={error} />
    ); 
}