
import { FormEvent, useRef, useState } from 'react';
import styles from './addNewListButton.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { CreateNewListRequest } from '@/app/dashboard/Services/listService';
import { useUserStore } from '@/Store/userStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { UserRole } from '@/app/dashboard/Types/boardTypes';
import AddNewListOptions from './addNewListOptions';

export default function AddNewListButton({
    boardId, 
    userRole, 
}: {
    boardId: number; 
    userRole: UserRole; 
}) {
    const isFormOpen = useBoardUIStore((state) => state.activePanel === 'newListForm'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const viewOnly = userRole === 'Viewer'; 

    if (viewOnly) {
        return null; 
    }


    return (
        <div className={styles.wrapper}>
            <button disabled={viewOnly} onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel(isFormOpen ? 'none' : 'newListForm'); 
            }}>
                <svg fill="none" viewBox="0 0 16 16" height={20} width={20}>
                    <path fill="currentcolor" fillRule="evenodd" d="M7.25 8.75V15h1.5V8.75H15v-1.5H8.75V1h-1.5v6.25H1v1.5z" clipRule="evenodd"/>
                </svg>
                <span>Add New List</span>
            </button>
            { isFormOpen && <AddNewListOptions boardId={boardId} /> }
        </div>
    ); 
}