
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import styles from './addNewListOptions.module.css'; 
import { useUserStore } from '@/Store/userStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { FormEvent, useState } from 'react';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { CreateNewListRequest } from '@/app/dashboard/Services/listService';

export default function AddNewListOptions({
    boardId, 
}: {
    boardId: number; 
}) {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const addNewListToBoard = useBoardStore((state) => state.AddNewListToBoard); 

    const [listName, setListName] = useState(''); 
    const [error, setError] = useState(''); 
    const [buttonDisabled, setButtonDisabled] = useState(false); 


    async function handleSubmit(e: FormEvent) {
        e.preventDefault(); 
        setButtonDisabled(true); 

        try {
            const request = await ApiRequestWithRefreshTokenAttemptAndData(CreateNewListRequest, { 
                boardId: boardId, newListName: listName, }); 

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


    return (
        <div className={styles.formContainer} onClick={(e) => {e.stopPropagation();}}>
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
                <div className={styles.listformButtons}>
                    <button className='button transparent-with-outline' type='button' disabled={buttonDisabled} onClick={(e) => {
                        e.stopPropagation(); 
                        setActivePanel('none'); 
                    }}>Cancel</button>
                    <button type='submit' className='button blue' disabled={listName === '' || buttonDisabled}>Add List</button>
                </div>
            </form>
        </div>
    ); 
}