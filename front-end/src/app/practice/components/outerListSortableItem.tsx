'use client'

import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import InnerList from './innerList';

export default function OuterListSortableItem({
    id, 
    name,
    data,
}: {
    id: UniqueIdentifier; 
    name: string; 
    data: { id: UniqueIdentifier }[]; 
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id}); 

    return (
        <div className='outerListSortableItem' ref={setNodeRef} {...attributes} {...listeners} style={{
            transform: CSS.Transform.toString(transform), 
            transition,
        }}
        >
            <header>{name}</header>
            <InnerList list={data} />
        </div>
    ); 
}