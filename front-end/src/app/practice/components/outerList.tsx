'use client'

import { horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndOuterList } from '../page';
import OuterListSortableItem from './outerListSortableItem';


export default function OuterList({
    outerList, 
}: {
    outerList: DndOuterList[]; 
}) {
    return (
        <div className='outerListSortableContext'>
            <SortableContext
                items={outerList}
                strategy={horizontalListSortingStrategy}
            >
                {
                    outerList.map(ol => (
                        <OuterListSortableItem id={ol.id} key={ol.id} name={ol.name} data={ol.data}/>
                    ))
                }
            </SortableContext>
        </div>
    ); 
}