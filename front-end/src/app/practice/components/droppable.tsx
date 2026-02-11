import { useDroppable } from "@dnd-kit/core";
import { useRef } from "react";

export default function Droppable({
    position, 
    children,
}: {
    position: number; 
    children?: React.ReactNode; 
}) {
    const {isOver, setNodeRef} = useDroppable({
        id: position, 
    }); 

    return (
        <div className={`droppable ${isOver ? 'overDroppable': ''}`} ref={setNodeRef}>
            {children}
        </div>
    );
}
