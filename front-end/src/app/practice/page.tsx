'use client'

import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { useState } from 'react';
import Droppable from './components/droppable';
import Draggable from './components/draggable';

export default function Practice() {
    const containers = [0, 1, 2]; 
    const [parent, setParent] = useState<UniqueIdentifier | null>(null); 

    function handleDragEnd(event: DragEndEvent) {
        const {over} = event; 
        setParent(over ? over.id : null); 
    }

    const draggableMarkup = (
        <Draggable id={0}>Drag me</Draggable>
    ); 

    return (
        <main className='dndContainer'>
            <DndContext onDragEnd={handleDragEnd}>
                {parent === null ? draggableMarkup : null}
                {containers.map((id) => 
                    <Droppable key={id} position={id}>
                        {parent === id ? draggableMarkup : 'Drop here'}
                    </Droppable>
                )}
            </DndContext>
        </main>
    ); 
}