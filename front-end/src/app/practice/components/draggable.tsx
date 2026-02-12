import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";


export default function Draggable({
    id,
    children, 
}: {
    id: UniqueIdentifier
    children?: React.ReactNode; 
}) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id, 
    }); 

    return (
        <div className='draggable' ref={setNodeRef} style={ transform ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        } : undefined } {...listeners} {...attributes}>
            <div>
                {children}
            </div>
        </div>
    ); 
}