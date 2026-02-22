
import { useSortable, UseSortableInput} from '@dnd-kit/react/sortable';
import {CollisionPriority} from '@dnd-kit/abstract';
import styles from './boardList.module.css'; 
import { ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function BoardList({
    children, 
    listId, 
    index,
}: {
    children: React.ReactNode; 
    listId: ListId; 
    index: number; 
}) {
    const {ref} = useSortable({
        id: listId,  
        index,
        type: 'boardList',
        collisionPriority: CollisionPriority.Low, 
    }); 

    const listDetails = useBoardStore((state) => state.lists[listId]); 

    return (
        <div className={styles.wrapper} ref={ref}>
            <div>
                <header>{listDetails.title}</header>
                {/* Create list menu which only opens if list id and panel are matched */}
                <button>list Menu</button>
            </div>
            <div>
                {children}
            </div>
            <div>
                <button>Add card button</button>
            </div>
        </div>
    ); 
}