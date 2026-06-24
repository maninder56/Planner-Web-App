import { useBoardStore } from "@/app/dashboard/Store/boardStore";
import HoverConfirmation from "@/Components/HoverConfirmation/hoverConfirmation";


export default function UserRemovedFromBoardDialogBox() {

    const SetUserRemovedFromCurrentBoard = useBoardStore((state) => state.SetUserRemovedFromCurrentBoard); 

    function handleConfirm() {
        SetUserRemovedFromCurrentBoard(false); 
    }

    return (
        <HoverConfirmation 
            title='Removed from board'
            message={`You are no longer a member of this board.`}
            onConfirmName='OK'
            onConfirm={handleConfirm} />
    ); 
}