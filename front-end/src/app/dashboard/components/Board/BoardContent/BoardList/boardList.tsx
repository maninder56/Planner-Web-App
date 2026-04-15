
import { useSortable, UseSortableInput} from '@dnd-kit/react/sortable';
import {CollisionPriority} from '@dnd-kit/abstract';
import styles from './boardList.module.css'; 
import { CardId, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import Image from 'next/image';
import ListMenuButton from './ListMenu/listMenuButton';
import { useRef, useState } from 'react';
import BoardCard from '../BoardCard/boardCard';
import {RestrictToVerticalAxis, RestrictToHorizontalAxis} from '@dnd-kit/abstract/modifiers';
import { useDroppable } from '@dnd-kit/react';
import { UserRole } from '@/app/dashboard/Types/boardTypes';
import { ConvertListIdToNumeric } from '@/app/dashboard/Utilities/listUtilities';
import { useUserStore } from '@/Store/userStore';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateListInfoRequest } from '@/app/dashboard/Services/listService';

export default function BoardList({
    boardId, 
    listId, 
    index,
    currentOpenListMenu,
    userRole, 
    setCurrentOpenListMenu,
    cardDetailsPanelId, 
    setCardDetailsPanelId, 
}: {
    boardId: number,
    listId: ListId; 
    index: number; 
    currentOpenListMenu: ListId | undefined; 
    userRole: UserRole; 
    setCurrentOpenListMenu: (listId: ListId | undefined) => void; 
    cardDetailsPanelId?: CardId; 
    setCardDetailsPanelId: (cardId?: CardId) => void; 
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
    }); 


    const viewOnly = userRole === 'Viewer'; 
    const numericListId = ConvertListIdToNumeric(listId); 


    const initialListName = useBoardStore((state) => state.lists[listId].name); 
    const listCardsIdsAndOrder = useBoardStore((state) => state.lists[listId].CardIDsAndOrder); 
    const setBoardError = useBoardStore((state) => state.setBoardError);  
    const UpdateListName = useBoardStore((state) => state.UpdateListName); 
    
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [listName, setListName] = useState(initialListName);
    
    const inputRef = useRef<HTMLInputElement | null>(null); 

    async function handleNameChange() {
        if (listName.trim() === '') {
            setListName(initialListName); 
            return;
        } else if (listName === initialListName) {
            return; 
        } else if (numericListId === -1) {
            setBoardError('Failed to change list name, please try again.')
            return; 
        }

        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateListInfoRequest, {
                boardId: boardId, listId: numericListId, listInfo: {
                    name: listName,
                }}
        ); 
        
        if (request.ok) {
            UpdateListName(listId, listName); 
            setBoardError(''); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
            setListName(initialListName); 
        } else {
            setBoardError('Failed to change list name, please try again.'); 
            setListName(initialListName); 
        }
    }

    async function handleEnterKeyAfterNameChange(key: string) {
        if (key === 'Enter') {
            
            if (inputRef.current) {
                inputRef.current.blur(); 
            }

            await handleNameChange(); 
        }
    }

    return (
        <div className={[styles.wrapper, isDragging ? styles.dragging : ''].join(' ')} ref={ref}>
            <div className={styles.header}>
                <header>
                    <input 
                        ref={inputRef}
                        className={styles.listName}
                        type='text'
                        maxLength={30}
                        disabled={viewOnly}
                        value={listName}
                        onClick={e => { e.stopPropagation(); }}
                        onChange={e => setListName(e.target.value)}
                        onBlur={handleNameChange}
                        onKeyDown={e => handleEnterKeyAfterNameChange(e.key)}/>
                </header>
                <ListMenuButton listId={listId} currentOpenListMenu={currentOpenListMenu} setCurrentOpenListMenu={setCurrentOpenListMenu} />
            </div>
            <div className={styles.cards} ref={dropRef}>
                {
                    listCardsIdsAndOrder.map((cardId, index) => (
                        <BoardCard cardId={cardId} index={index} key={cardId} parentListId={listId} 
                            cardDetailsPanelId={cardDetailsPanelId} setCardDetailsPanelId={setCardDetailsPanelId} />
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