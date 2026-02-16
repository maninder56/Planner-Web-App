'use client'

import { closestCenter, closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { act, useState } from 'react';
import Droppable from './components/droppable';
import Draggable from './components/draggable';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './components/sortableItem';
import OuterColumn from './components/outerColumn';
import OuterList from './components/outerList';


export interface DndOuterList {
    id: UniqueIdentifier,
    name: string, 
    data: {
        id: UniqueIdentifier,
    }[]
};  

export default function Practice() {

    const sensors = useSensors(
        useSensor(PointerSensor), 
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    ); 

    const [dndArray, setDndArray] = useState<DndOuterList[]>([
        { id: 'A', name: 'List A', data: [{ id: 'A1'}, { id: 'A2' }]}, 
        { id: 'B', name: 'List B', data: [{ id: 'B1'}, { id: 'B2' }]}, 
    ]); 

    


    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event; 
        console.log(`Active: ${active.id}, Over: ${over?.id}`); 

        if (active.id === over?.id || over?.id === undefined) {
            return; 
        }

        const newArray = [...dndArray]; 
        
        const outerOldIndex = dndArray.findIndex(i => i.id === active.id); 
        const outerNewIndex = dndArray.findIndex(i => i.id === over.id); 

        if (outerOldIndex !== -1 && outerNewIndex !== -1) { // check if outer list has been changed
            setDndArray(array => arrayMove(array, outerOldIndex, outerNewIndex)); 
            return; 
        }

        function findParentsOfList(activeId: UniqueIdentifier, overId: UniqueIdentifier) {
            const activeParentId = findParentId(activeId); 
            const overParentId = findParentId(overId); 
            return {activeParentId, overParentId}; 
        }

        function findParentId(childId: UniqueIdentifier) {
            return newArray.find(l => l.data.find(l2 => l2.id === childId))?.id; 
        }

        function findInnerChildIndex(id: UniqueIdentifier, parentId: UniqueIdentifier) {
            return newArray.find(l => l.id === parentId)?.data.findIndex(i => i.id === id); 
        }


        const {activeParentId, overParentId} = findParentsOfList(active.id, over.id); 

        if (activeParentId === undefined || overParentId === undefined) {
            return; 
        }

        if (activeParentId === overParentId) { // check if parents of inner list are same
            const oldIndex = findInnerChildIndex(active.id, activeParentId); 
            const newIndex = findInnerChildIndex(over.id, overParentId); 

            if (oldIndex === undefined || newIndex === undefined) {
                return; 
            }

            const childData = newArray.find(i => i.id === activeParentId)?.data; 

            if (childData === undefined) {
                return; 
            }

            const newChildData = arrayMove(childData, oldIndex, newIndex); 
            const parentIndex = newArray.findIndex(l => l.id === activeParentId); 
            newArray[parentIndex].data = newChildData; 
            setDndArray(newArray); 
            return; 
        } else { // if parents are not equal
            const childData = newArray.find(i => i.id === overParentId)?.data; 

            if (childData === undefined) {
                return; 
            }

            const activeParentIndex = newArray.findIndex(l => l.id === activeParentId); 
            const overParentIndex = newArray.findIndex(l => l.id === overParentId); 

            // remove the child from parent 
            const tempChildData = newArray[activeParentIndex].data.find(i => i.id === active.id); 

            if (tempChildData === undefined) {
                return; 
            }

            newArray[activeParentIndex].data = newArray[activeParentIndex].data.filter(i => i.id !== active.id); 

            // Add the child to new parent
            const oldIndex = newArray[overParentIndex].data.length; 
            const newIndex = findInnerChildIndex(over.id, overParentId); 
            if (newIndex === undefined) {
                return; 
            }

            const newChildData = arrayMove(childData, oldIndex, newIndex); 
            newChildData[newIndex] = tempChildData; 
            newArray[overParentIndex].data = newChildData; 
            console.log(newChildData); 
            setDndArray(newArray); 
            return; 
        }

      
    }

    function handleDragOver(event: DragEndEvent) {
        const {active, over} = event; 


        console.log(`A: ${active.id}, O: ${over?.id}`); 
        // console.log(`dndObject: ${dndObject}`); 
    }

    return (
        <main className='dndWrapper'>
            <div className='dndContext'>
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                    // onDragOver={handleDragOver}
                >
                    <OuterList outerList={dndArray} />
                </DndContext>       
            </div>
            {/* <div>
                <div>List A{JSON.stringify(dndObject.A)}</div>
                <div>List B{JSON.stringify(dndObject.B)}</div>
            </div> */}
        </main>
    ); 
} 