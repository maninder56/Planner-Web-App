
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './addNewCardPanel.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { FormEvent, useEffect, useState } from 'react';
import { CardPriority } from '@/app/dashboard/Types/boardTypes';
import Button from '@/Components/Buttons/button';

export default function AddNewCardPanel({
    boardId, 
    parentListId, 

}: {
    boardId: number;
    parentListId: number;  
}) {
    const getLocalDate = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const [title, setTitle] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [isDone, setIsDone] = useState(false); 
    const [dueDate, setDueDate] = useState(getLocalDate()); 
    const [priority, setPriority] = useState<CardPriority>('Low'); 
    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const [submitError, setSubmitError] = useState('can not submit form'); 
    const [titleError, setTitleError] = useState('title is required'); 


    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault(); 
    }

    function handlePriorityChange(value: string) {
        if (value === 'Low' || value === 'Medium' || value === 'High') {
            setPriority(value); 
        }
    }

    return (
        <BigHoverPanel title='Add New Card' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                <form className={styles.cardForm} onSubmit={handleFormSubmit}>
                    <div className={styles.error}>{submitError}</div>
                    <div className={styles.checkboxAndTitle}>
                        <input className={styles.checkbox} type='checkbox' name='isDone' checked={isDone} onChange={e => setIsDone(e.target.checked)} />
                        <div>
                            <input className={[styles.title, isDone ? styles.taskDone : ''].join(' ')} type='text' 
                                name='title' placeholder='Title...' maxLength={50} value={title} autoFocus={true} 
                                onChange={e => setTitle(e.target.value)} />
                            <span></span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <header>Priority</header>
                            <select name='priority' value={priority} onChange={e => handlePriorityChange(e.target.value)}>
                                <option value={'Low'}>Low</option>
                                <option value={'Medium'}>Medium</option>
                                <option value={'High'}>High</option>
                            </select>
                        </div>
                        <div>
                            <header>Due Date</header>
                            <input type='date' name='dueDate' value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <header>Description</header>
                        <input type='text' name='description' maxLength={400} value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <Button name='Cancle' color='transparent-with-outline' disabled={buttonDisabled} onClick={() => setActivePanel('none')} />
                        <button type='submit' className='button blue' disabled={buttonDisabled || title === ''}>Save</button>
                    </div>
                </form>
            </div>
        </BigHoverPanel>
    ); 
}