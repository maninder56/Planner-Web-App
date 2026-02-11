'use client'

import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { useState } from 'react';
import Droppable from './components/droppable';
import Draggable from './components/draggable';

export default function Practice() {
    const [parent, setParent] = useState<UniqueIdentifier[]>([0, 1, 2]); 

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event; 
        
        const array = [...parent]; 

        // for (let i = 0; i < parent.length; i++) {
            
        // }
        

        if (over !== null) {
            const overPosition = over?.id as number
            const activePosition = array.indexOf(active.id); 

            console.log(`op: ${overPosition}, ap: ${activePosition}`);

            const temp = array[overPosition]; 
            array[overPosition] = array[activePosition]; 
            array[activePosition] = temp; 

            console.log(`Over: ${over.id}, Active: ${active.id}`); 
        }

        console.log(array); 

        setParent(array); 
    }

    // const draggableMarkup = (
    //     <Draggable id={0}>Drag me</Draggable>
    // ); 

    function getCurrentChild(id: number) {
        switch(id) {
            case 0: 
            return <Draggable id={0}>0</Draggable>; 

            case 1: 
            return <Draggable id={1}>1</Draggable>; 

            case 2: 
            return <Draggable id={2}>2</Draggable>; 

            default: 
            return <Draggable id={3}>None</Draggable>
        }
    }

    return (
        <main className='dndContainer'>
            <DndContext onDragEnd={handleDragEnd}>
                {/* {parent === null ? draggableMarkup : null} */}
                {/* {containers.map((id) => 
                    <Droppable key={id} position={id}>
                        {parent === id ? draggableMarkup : 'Drop here'}
                    </Droppable>
                )} */}
                <Droppable position={0}>
                    {getCurrentChild(parent[0] as number)}
                </Droppable>
                <Droppable position={1}>
                    {getCurrentChild(parent[1] as number)}
                </Droppable>
                <Droppable position={2}>
                    {getCurrentChild(parent[2] as number)}
                </Droppable>
            </DndContext>
        </main>
    ); 
}