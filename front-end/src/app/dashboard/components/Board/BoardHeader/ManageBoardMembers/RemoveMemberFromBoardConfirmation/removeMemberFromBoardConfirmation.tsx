import { BoardMemberData } from "@/app/dashboard/Types/boardTypes";
import HoverConfirmation from "@/Components/HoverConfirmation/hoverConfirmation";
import { useState } from "react";

export default function RemoveMemberFromBoardConfirmation({
    memberData, 
    onCancel
}: {
    memberData: BoardMemberData; 
    onCancel: () => void; 
}) {

    const userName = memberData.name.length > 30 
        ? `${memberData.name.slice(0, 30)}...`
        : memberData.name; 

    const [error, setError] = useState(''); 

    async function handleConfirm() {
        
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