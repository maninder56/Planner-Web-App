
import { useSortable, UseSortableInput} from '@dnd-kit/react/sortable';
import {CollisionPriority} from '@dnd-kit/abstract';
import styles from './boardList.module.css'; 
import { ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import Image from 'next/image';
import ListMenuButton from './ListMenu/listMenuButton';
import { useState } from 'react';
import BoardCard from '../BoardCard/boardCard';
import {RestrictToVerticalAxis, RestrictToHorizontalAxis} from '@dnd-kit/abstract/modifiers';
import { useDroppable } from '@dnd-kit/react';

export default function BoardList({
    listId, 
    index,
    currentOpenListMenu,
    setCurrentOpenListMenu,
}: {
    listId: ListId; 
    index: number; 
    currentOpenListMenu: ListId | undefined; 
    setCurrentOpenListMenu: (listId: ListId | undefined) => void; 
}) {
    const {ref, isDragging} = useSortable({
        id: listId,  
        index,
        type: 'boardList',
        accept: 'boardList', 
        collisionPriority: CollisionPriority.Low, 
        modifiers: [RestrictToHorizontalAxis],
    }); 

    const {ref: dropRef} = useDroppable({
        id: `drop${listId}`, 
        type: 'cardDropZone', 
        accept: 'boardCard', 
        data: {
            listId, 
        }
    })

    const listTitle = useBoardStore((state) => state.lists[listId].title); 
    const listCardsIdsAndOrder = useBoardStore((state) => state.lists[listId].CardIDsAndOrder); 

    return (
        <div className={[styles.wrapper, isDragging ? styles.dragging : ''].join(' ')} ref={ref}>
            <div className={styles.header}>
                <header>{listTitle}</header>
                {/* Create list menu which only opens if list id and panel are matched */}
                <ListMenuButton listId={listId} currentOpenListMenu={currentOpenListMenu} setCurrentOpenListMenu={setCurrentOpenListMenu} />
            </div>
            <div className={styles.cards} ref={dropRef}>
                {
                    listCardsIdsAndOrder.map((cardId, index) => (
                        <BoardCard cardId={cardId} index={index} key={cardId} parentListId={listId} />
                    ))
                }
            </div>
            <div className={styles.addNewCardContainer}>
                <button>
                    <Image src={'./plusSign.svg'} alt='plus sign' width={10} height={10} />
                    <span>Add card button</span>
                </button>
            </div>
            {/* <div>{JSON.stringify(listCardsIdsAndOrder)}</div> */}
        </div>
    ); 
}