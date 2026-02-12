'use client'

import { DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { useState } from 'react';
import Droppable from './components/droppable';
import Draggable from './components/draggable';

export default function Practice() {
    const [tasksOrder, setTasksOrder] = useState<UniqueIdentifier[]>(['A', 'B', 'C', 'D', 'E', 'F']); 

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event; 
        if (over === null) {
            return; 
        }

        const newOrder = [...tasksOrder]; 

        const indexOfActiveTask = newOrder.indexOf(active.id); 

        const tempTask = newOrder[over.id as number]; 
        newOrder[over.id as number] = active.id; 
        newOrder[indexOfActiveTask] = tempTask; 
        
        setTasksOrder(newOrder); 
    }

    return (
        <main className='dndWrapper'>
            <div className='dndContainer'>
                <DndContext onDragEnd={handleDragEnd}>
                    {
                        tasksOrder.map((t, i) => (
                            <Droppable key={i} id={i}>
                                <Draggable id={t}>
                                    <span>Task {t}</span>
                                </Draggable>
                            </Droppable>
                        ))
                    }
                </DndContext>       
            </div>
        </main>
    ); 
}