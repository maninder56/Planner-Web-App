
import { FormEvent, useRef, useState } from 'react';
import styles from './addNewListButton.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { CreateNewListRequest } from '@/app/dashboard/Services/listService';
import { useUserStore } from '@/Store/userStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { UserRole } from '@/app/dashboard/Types/boardTypes';

export default function AddNewListButton({
    boardId, 
    userRole, 
}: {
    boardId: number; 
    userRole: UserRole; 
}) {
    const isFormOpen = useBoardUIStore((state) => state.activePanel === 'newListForm'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const addNewListToBoard = useBoardStore((state) => state.AddNewListToBoard); 

    const [listName, setListName] = useState(''); 
    const [error, setError] = useState(''); 
    const [buttonDisabled, setButtonDisabled] = useState(false); 

    const viewOnly = userRole === 'Viewer'; 

    async function handleSubmit(e: FormEvent) {
        e.preventDefault(); 
        setButtonDisabled(true); 

        try {
            const request = await ApiRequestWithRefreshTokenAttemptAndData(CreateNewListRequest, { boardId: boardId, newListName: listName, }); 

            if (request.ok && request.data !== undefined) {
                addNewListToBoard({id: request.data.id, title: request.data.name, position: request.data.listPosition}); 
                setListName(''); 
                setError(''); 
                setActivePanel('none'); 
            } else if (!request.ok && request.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else {
                setError('Failed to create new List, please try again.'); 
            }
        } finally {
            setButtonDisabled(false); 
        }
    }

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
            { 
                isFormOpen &&
                <div className={styles.fromContainer} onClick={(e) => {e.stopPropagation();}}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputContainer}>
                            <input
                                name='newListName'
                                type='text'
                                placeholder='Enter list name...'
                                maxLength={30}
                                value={listName}
                                autoFocus={true}
                                onChange={(e) => setListName(e.target.value)} />
                        </div>
                        <span className={styles.error}>{error}</span>
                        <div className={styles.listFromButtons}>
                            <button className='button transparent-with-outline' type='button' disabled={buttonDisabled} onClick={(e) => {
                                e.stopPropagation(); 
                                setActivePanel('none'); 
                            }}>Cancel</button>
                            <button type='submit' className='button blue' disabled={listName === '' || buttonDisabled}>Add List</button>
                        </div>
                    </form>
                </div>
            }
        </div>
    ); 
}