import { UniqueIdentifier } from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities'; 
import { useSortable } from '@dnd-kit/sortable';


export default function SortableItem({
    id,
    children, 
}: {
    id: UniqueIdentifier; 
    children: React.ReactNode; 
}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: id}); 

    return (
        <div 
            className='sortableItem'
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={{
                transform: CSS.Transform.toString(transform), 
                transition: transition
            }}
        >
            {children}
        </div>
    ); 
}