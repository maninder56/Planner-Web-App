
import { useSortable, UseSortableInput} from '@dnd-kit/react/sortable';
import {CollisionPriority} from '@dnd-kit/abstract';
import styles from './boardList.module.css'; 
import { ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import Image from 'next/image';

export default function BoardList({
    children, 
    listId, 
    index,
}: {
    children: React.ReactNode; 
    listId: ListId; 
    index: number; 
}) {
    const {ref, isDragging} = useSortable({
        id: listId,  
        index,
        type: 'boardList',
        collisionPriority: CollisionPriority.Low, 
    }); 

    const listDetails = useBoardStore((state) => state.lists[listId]); 

    return (
        <div className={[styles.wrapper, isDragging ? styles.dragging : ''].join(' ')} ref={ref}>
            <div className={styles.header}>
                <header>{listDetails.title}</header>
                {/* Create list menu which only opens if list id and panel are matched */}
                <button>list Menu</button>
            </div>
            <div className={styles.cards}>
                {children}
            </div>
            <div className={styles.addNewCardContainer}>
                <button>
                    <Image src={'./plusSign.svg'} alt='plus sign' width={10} height={10} />
                    <span>Add card button</span>
                </button>
            </div>
        </div>
    ); 
}