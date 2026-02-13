import { UniqueIdentifier } from '@dnd-kit/core';
import SortableItem from './sortableItem';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities'; 

export default function OuterColumn({
    id,
    children, 
}: {
    id: UniqueIdentifier; 
    children: React.ReactNode; 
}) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: id}); 

    return (
        <div className='outerColumn' {...attributes} {...listeners} ref={setNodeRef} 
            style={{
                transform: CSS.Transform.toString(transform), 
                transition: transition,
            }}
        > 
        {/* Add sortable context */}
                {children}
        </div>
    ); 
}