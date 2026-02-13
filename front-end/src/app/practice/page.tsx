'use client'

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { act, useState } from 'react';
import Droppable from './components/droppable';
import Draggable from './components/draggable';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './components/sortableItem';
import OuterColumn from './components/outerColumn';

export default function Practice() {

    const sensors = useSensors(
        useSensor(PointerSensor), 
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    ); 

    const [dndArray, setDndArray] = useState<{
        id: UniqueIdentifier, 
        data: {
            id: UniqueIdentifier,
        }[]
    }[]>([
        { id: 'A', data: [{ id: 'A1'}, { id: 'A2' }]}, 
        { id: 'B', data: [{ id: 'B1'}, { id: 'B2' }]}, 
    ]); 


    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event; 


        if (active.id !== over?.id) {
            setDndArray(array => {
                const oldIndex = dndArray.findIndex(i => i.id === active.id); 
                const newIndex = dndArray.findIndex(i => i.id === over?.id); 

                console.log(`oldIndex: ${oldIndex}, newIndex: ${newIndex}`); 

                return arrayMove(array, oldIndex, newIndex); 
            })
        }

        console.log(`A: ${active.id}, O: ${over?.id}`); 
    }

    function handleDragOver(event: DragEndEvent) {
        const {active, over} = event; 


        console.log(`A: ${active.id}, O: ${over?.id}`); 
        // console.log(`dndObject: ${dndObject}`); 
    }

    return (
        <main className='dndWrapper'>
            <div className='outerColumnContainer'>
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    // onDragOver={handleDragOver}
                >
                    <SortableContext
                        items={dndArray}
                        strategy={horizontalListSortingStrategy}
                    >
                        {
                            dndArray.map(i => (
                                <OuterColumn id={i.id} key={i.id}>
                                    <div className='innerListContainer' key={i.id}>
                                        <SortableContext
                                            items={i.data}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {
                                                i.data.map(d => (
                                                    <SortableItem id={d.id} key={d.id}>
                                                        <span>{d.id}</span>
                                                    </SortableItem>
                                                ))
                                            }
                                        </SortableContext>
                                    </div>
                                </OuterColumn>
                            ))
                        }
                    </SortableContext>
                </DndContext>       
            </div>
            {/* <div>
                <div>List A{JSON.stringify(dndObject.A)}</div>
                <div>List B{JSON.stringify(dndObject.B)}</div>
            </div> */}
        </main>
    ); 
} 