
import { useSortable, UseSortableInput} from '@dnd-kit/react/sortable';
import {CollisionPriority} from '@dnd-kit/abstract';
import styles from './boardList.module.css'; 
import { CardId, ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';
import Image from 'next/image';
import ListMenuButton from './ListMenu/listMenuButton';
import { useRef, useState } from 'react';
import BoardCard from '../BoardCard/boardCard';
import {RestrictToVerticalAxis, RestrictToHorizontalAxis} from '@dnd-kit/abstract/modifiers';
import {RestrictToElement, RestrictToWindow} from '@dnd-kit/dom/modifiers';
import { useDroppable } from '@dnd-kit/react';
import { UserRole } from '@/app/dashboard/Types/boardTypes';
import { ConvertListIdToNumeric } from '@/app/dashboard/Utilities/listUtilities';
import { useUserStore } from '@/Store/userStore';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateListInfoRequest } from '@/app/dashboard/Services/listService';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import {
  closestCenter,
  pointerIntersection,
  directionBiased
} from '@dnd-kit/collision';

export default function BoardList({
    boardId, 
    listId, 
    index,
    currentOpenListMenu,
    userRole, 
    setCurrentOpenListMenu,
    setCardDetailsPanelData, 
    setCreateNewCardListId
}: {
    boardId: number,
    listId: ListId; 
    index: number; 
    currentOpenListMenu: ListId | undefined; 
    userRole: UserRole; 
    setCurrentOpenListMenu: (listId: ListId | undefined) => void; 
    setCardDetailsPanelData: (data: {parentListId: ListId, cardId: CardId} | undefined) => void; 
    setCreateNewCardListId: (listId: number | undefined) => void; 
}) {
    const viewOnly = userRole === 'Viewer'; 
    const numericListId = ConvertListIdToNumeric(listId); 

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const initialListName = useBoardStore((state) => state.lists[listId].name); 
    const listCardsIdsAndOrder = useBoardStore((state) => state.lists[listId].CardIDsAndOrder); 
    const setBoardError = useBoardStore((state) => state.setBoardError);  
    const UpdateListName = useBoardStore((state) => state.UpdateListName); 
    
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [listName, setListName] = useState(initialListName);
    
    const inputRef = useRef<HTMLInputElement | null>(null); 

    const {ref, handleRef, isDragging} = useSortable({
        id: listId,  
        index,
        type: 'boardList',
        accept: 'boardList', 
        collisionDetector: directionBiased, 
        collisionPriority: CollisionPriority.Normal, 
        modifiers: [RestrictToHorizontalAxis, RestrictToWindow],
        disabled: viewOnly, 
    }); 

    const {ref: dropRef} = useDroppable({
        id: `drop${listId}`, 
        type: 'cardDropZone', 
        accept: 'boardCard', 
        data: {
            listId, 
        }, 
        // disable drop area if list has cards
        disabled: viewOnly || listCardsIdsAndOrder.length > 0,
        // collisionDetector: pointerIntersection, 
        collisionPriority: CollisionPriority.Normal,
    }); 


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
            inputRef.current?.blur(); 
            await handleNameChange(); 
        }
    }

    if (!true) {
        return (
            <div className={`${styles.wrapper} ${styles.hidden}`} ref={ref}>
                <svg className='fadeIn' xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"/>
                </svg>
            </div>
        ); 
    }

    return (
        <div className={[styles.wrapper, isDragging ? styles.dragging : ''].join(' ')} ref={ref}>
            <div className={styles.header}>
                <div ref={handleRef} className={styles.grabListIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6h.01M15 6h.01M15 12h.01M9 12h.01M9 18h.01M15 18h.01M10 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" 
                            stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
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
                        <BoardCard cardId={cardId} index={index} key={cardId} parentListId={listId} userRole={userRole}
                            setCardDetailsPanelData={setCardDetailsPanelData} />
                    ))
                }
            </div>
            <div className={styles.addNewCardContainer}>
                <button disabled={viewOnly} className='button transparent-with-outline' onClick={(e) => {
                    e.stopPropagation(); 
                    if (numericListId !== -1) {
                        setCreateNewCardListId(numericListId); 
                        setActivePanel('createNewCardPanel'); 
                        setBoardError(''); 
                    } else {
                        setCreateNewCardListId(undefined); 
                        setBoardError('Error occured while opening new card form, please try again'); 
                    }
                }}>
                    <svg height="20" width="20" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" 
                        clipRule="evenodd" strokeLinecap="round"  strokeLinejoin="round">
                        <path d="M6 12h12m-6-6v12" fill="none" fillRule="nonzero" stroke="#000" 
                            strokeWidth="2" transform="matrix(56.51202 0 0 56.51203 -278.144 -278.144)"/>
                    </svg>
                    <span>Add card</span>
                </button>
            </div>
        </div>
    ); 
}