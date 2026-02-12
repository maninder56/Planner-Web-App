'use client'

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
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
            // if they are in same container
            if (listA.find(i => i === active.id) && listA.find(i => i === over?.id)) {
                setListA((listA) => {
                    const newIndex = listA.indexOf(over?.id as number); 
                    const oldIndex = listA.indexOf(active.id as number); 

                    return arrayMove(listA, oldIndex, newIndex); 
                })
            } else if (listB.find(i => i === active.id) && listB.find(i => i === over?.id)) {
                setListB((listB) => {
                    const newIndex = listB.indexOf(over?.id as number); 
                    const oldIndex = listB.indexOf(active.id as number); 

                    return arrayMove(listB, oldIndex, newIndex); 
                })
            } else if (listA.find(i => i === over?.id) && listB.find(i => i === active.id)) { // if element moves from B -> A
                setListB(listB.filter(i => i !== active.id)); 
                setListA(() => {
                    const list = [...listA, active.id]; 
                    const newIndex = listA.indexOf(over?.id as number); 
                    const oldIndex = listA.length; 

                    return arrayMove(list, oldIndex, newIndex) as number[]; 
                })
            } else if (listB.find(i => i == over?.id) && listA.find(i => i === active.id)) { // if element moves from A -> B
                setListA(listA.filter(i => i !== active.id)); 
                setListB(() => {
                    const list = [...listB, active.id]; 
                    const newIndex = listB.indexOf(over?.id as number); 
                    const oldIndex = listB.length; 

                    return arrayMove(list, oldIndex, newIndex) as number[]; 
                })
            } else if (listB.length === 0 && listA.find(i => i === active.id)) { // if list B is empty and element moves from A -> B
                setListA(listA.filter(i => i !== active.id)); 
                setListB(() => {
                    const list = [...listB, active.id]; 
                    const newIndex = 0; 
                    const oldIndex = list.length; 

                    return arrayMove(list, oldIndex, newIndex) as number[]; 
                })
            }
        }
    }

    function handleDragOver(event: DragEndEvent) {
        const {active, over} = event; 

        // if (active.id !== over?.id) {
        //     if (listA.find(i => i !== active.id) && listB.find(i => i !== over?.id)) {
        //         setListB(listB.filter(i => i !== active.id)); 
        //     }
        // }

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