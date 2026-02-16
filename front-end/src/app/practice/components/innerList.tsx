'use client'

import { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import InnerListSortableItem from './innerListSortableItem';


export default function InnerList({
    list,
}: {
    list: { id: UniqueIdentifier }[]; 
}) {
    return (
        <div className='innerListSortableContext'>
            <SortableContext
                items={list}
                strategy={verticalListSortingStrategy}
            >
                {
                    list.map(l => (
                        <InnerListSortableItem id={l.id} key={l.id} />
                    ))
                }
            </SortableContext>
        </div>
    );
}