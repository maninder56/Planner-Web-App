import { useBoardStore } from "@/app/dashboard/Store/boardStore";
import { UsersMembershipChnagedData } from "@/app/dashboard/Types/boardTypes";
import HoverConfirmation from "@/Components/HoverConfirmation/hoverConfirmation";


export default function UserRoleChangedDialogBox({
    newMembershipData
}: {
    newMembershipData : UsersMembershipChnagedData; 
}) {

    const SetUserMembershipChanged = useBoardStore((state) => state.SetUserMembershipChanged); 

    function handleConfirm() {
        SetUserMembershipChanged(undefined); 
    }

    return (
        <HoverConfirmation 
            title='Role Changed'
            message={`Your role in this board has changed to '${newMembershipData.newRole}'.`}
            onConfirmName='Ok'
            onConfirm={handleConfirm} />
    ); 
}