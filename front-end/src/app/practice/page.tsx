'use client'

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { act, useState } from 'react';
import Droppable from './components/droppable';
import Draggable from './components/draggable';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './components/sortableItem';

export default function Practice() {

    const [dndObject, setDndObject] = useState({
        A: [1, 2, 3],
        B: [4, 5, 6], 
    })

    const sensors = useSensors(
        useSensor(PointerSensor), 
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    ); 

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event; 

        if (active.id !== over?.id) {

            const activeItemInListA = dndObject.A.includes(active.id as number); 
            const overItemInListA = dndObject.A.includes(over?.id as number); 

            const activeItemInListB = dndObject.B.includes(active.id as number); 
            const overItemInListB = dndObject.B.includes(over?.id as number); 
        

            // if they are in same container
            if (activeItemInListA && overItemInListA) { // if they are in same comtainer for A

                const listA = dndObject.A; 
                const newIndex = listA.indexOf(over?.id as number); 
                const oldIndex = listA.indexOf(active.id as number); 
                const newList = arrayMove(listA, oldIndex, newIndex); 

                setDndObject({...dndObject, A: newList }); 

            } else if (activeItemInListB && overItemInListB) { // if they are in same comtainer for B

                const listB = dndObject.B; 
                const newIndex = listB.indexOf(over?.id as number); 
                const oldIndex = listB.indexOf(active.id as number); 
                const newList = arrayMove(listB, oldIndex, newIndex); 

                setDndObject({...dndObject, B: newList }); 

            } else if ((overItemInListA || over?.id === 10) && activeItemInListB) { // if element moves from B -> A
                const newListB = dndObject.B.filter(i => i !== active.id)

                const list = [...dndObject.A, active.id]; 
                const newIndex = list.indexOf(over?.id as number); 
                const oldIndex = list.indexOf(active.id as number); 
                const newListA = arrayMove(list, oldIndex, newIndex) as number[]; 
                
                setDndObject({A: newListA, B: newListB}); 

            } else if ((overItemInListB || over?.id === 11) && activeItemInListA) { // if element moves from A -> B

                const newListA = dndObject.A.filter(i => i !== active.id)

                const list = [...dndObject.B, active.id]; 
                const newIndex = list.indexOf(over?.id as number); 
                const oldIndex = list.indexOf(active.id as number); 
                const newListB = arrayMove(list, oldIndex, newIndex) as number[]; 
                
                setDndObject({A: newListA, B: newListB}); 
            } 
        }
    }

    function handleDragOver(event: DragEndEvent) {
        const {active, over} = event; 


        console.log(`A: ${active.id}, O: ${over?.id}`); 
        // console.log(`dndObject: ${dndObject}`); 
    }

    return (
        <main className='dndWrapper'>
            <div className='dndContainer'>
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                >
                    <div className='listContainer'>
                        <SortableContext
                            items={dndObject.A}
                            strategy={verticalListSortingStrategy}
                        >
                            <Droppable id={10}>
                                {dndObject.A.map(id => <SortableItem key={id} id={id}><span>{id}</span></SortableItem>)}
                            </Droppable>
                        </SortableContext>
                    </div>

                    <div className='listContainer'>
                        <SortableContext
                            items={dndObject.B}
                            strategy={verticalListSortingStrategy}
                        >
                            <Droppable id={11}>
                                {dndObject.B.map(id => <SortableItem key={id} id={id}><span>{id}</span></SortableItem>)}
                            </Droppable>
                        </SortableContext>
                    </div>
                </DndContext>       
            </div>
            <div>
                <div>List A{JSON.stringify(dndObject.A)}</div>
                <div>List B{JSON.stringify(dndObject.B)}</div>
            </div>
        </main>
    ); 
}