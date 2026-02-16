'use client'

import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';


export default function InnerListSortableItem({
    id,
}: {
    id: UniqueIdentifier; 
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id }); 

    return (
        <div className='innerListSortableItem' ref={setNodeRef} {...attributes} {...listeners} style={{
            transform: CSS.Transform.toString(transform), 
            transition,
        }}
        >
            <span>{id}</span>
        </div>
    ); 
}