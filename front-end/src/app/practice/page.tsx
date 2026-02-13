'use client'

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { act, useState } from 'react';
import Droppable from './components/droppable';
import Draggable from './components/draggable';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './components/sortableItem';

export default function Practice() {

    const [listA, setListA] = useState([1, 2, 3]); 
    const [listB, setListB] = useState([4, 5, 6]); 

    const sensors = useSensors(
        useSensor(PointerSensor), 
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    ); 

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event; 

        if (active.id !== over?.id) {

            const activeItemInListA = typeof(listA.find(i => i === active.id)) !== 'undefined'; 
            const overItemInListA = typeof(listA.find(i => i === over?.id)) !== 'undefined'; 

            const activeItemInListB = typeof(listB.find(i => i === active.id)) !== 'undefined'; 
            const overItemInListB = typeof(listB.find(i => i === over?.id)) !== 'undefined'; 
        
            const listBEmpty = listB.length === 0; 
            const listAEmpty = listA.length === 0; 

            // if they are in same container
            if (activeItemInListA && overItemInListA) { // if they are in same comtainer for A
                setListA((listA) => {
                    const newIndex = listA.indexOf(over?.id as number); 
                    const oldIndex = listA.indexOf(active.id as number); 

                    return arrayMove(listA, oldIndex, newIndex); 
                })
            } else if (activeItemInListB && overItemInListB) { // if they are in same comtainer for B
                setListB((listB) => {
                    const newIndex = listB.indexOf(over?.id as number); 
                    const oldIndex = listB.indexOf(active.id as number); 

                    return arrayMove(listB, oldIndex, newIndex); 
                })
            } else if (overItemInListA && activeItemInListB && active.id !== 0) { // if element moves from B -> A
                const newListB = listB.filter(i => i !== active.id)

                if (newListB.length === 0) {
                    setListB([0]); 
                } else {
                    setListB(newListB); 
                }

                const newListA = listA.filter(i => i !== 0); 

                setListA(() => {
                    const list = [...newListA, active.id]; 
                    const newIndex = newListA.indexOf(over?.id as number); 
                    const oldIndex = newListA.length; 

                    return arrayMove(list, oldIndex, newIndex) as number[]; 
                })
            } else if (overItemInListB && activeItemInListA && active.id !== 0) { // if element moves from A -> B

                const newListA = listA.filter(i => i !== active.id); 

                if (newListA.length === 0) {
                    setListA([0]); 
                } else {
                    setListA(newListA); 
                }

                const newListB = listB.filter(i => i !== 0); 

                setListB(() => {
                    const list = [...newListB, active.id]; 
                    const newIndex = newListB.indexOf(over?.id as number); 
                    const oldIndex = newListB.length; 

                    return arrayMove(list, oldIndex, newIndex) as number[]; 
                })
            } 
        }
    }

    function handleDragOver(event: DragEndEvent) {
        const {active, over} = event; 


        console.log(`A: ${active.id}, O: ${over?.id}`); 
        console.log(`ListA: ${listA}, ListB: ${listB}`); 
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
                            items={listA}
                            strategy={verticalListSortingStrategy}
                        >
                            {listA.map(id => <SortableItem key={id} id={id}><span>{id}</span></SortableItem>)}
                        </SortableContext>
                    </div>

                    <div className='listContainer'>
                        <SortableContext
                            items={listB}
                            strategy={verticalListSortingStrategy}
                        >
                            {listB.map(id => <SortableItem key={id} id={id}><span>{id}</span></SortableItem>)}
                        </SortableContext>
                    </div>
                </DndContext>       
            </div>
            <div>
                <div>List A{JSON.stringify(listA)}</div>
                <div>List B{JSON.stringify(listB)}</div>
            </div>
        </main>
    ); 
}