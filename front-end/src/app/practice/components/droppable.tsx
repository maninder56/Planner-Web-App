import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { useRef } from "react";

export default function Droppable({
    id, 
    children,
}: {
    id: UniqueIdentifier; 
    children?: React.ReactNode; 
}) {
    const {isOver, setNodeRef} = useDroppable({
        id: id, 
    }); 

    return (
        <div className={`droppable ${isOver ? 'overDroppable': ''}`} ref={setNodeRef}>
            {children}
        </div>
    );
}
