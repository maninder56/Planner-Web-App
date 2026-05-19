
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './shareButtonOptions.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import FormInput from '@/Components/Inputs/formInput';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { UserRole } from '@/app/dashboard/Types/boardTypes';
import { ValidateEmail } from '@/Utilities/validations';
import { useUserStore } from '@/Store/userStore';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { SendNewInvitationRequest } from '@/app/dashboard/Services/invitationService';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';

export default function ShareButtonOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 
    const boardId = useBoardStore((state) => state.currentBoardData?.id); 
    
    const [email, setEmail] = useState(''); 
    const [userRole, setUserRole] = useState<UserRole>('Member'); 
    const availalbeRoles: UserRole[] = ['Member', 'Viewer']; 
    const emailInputRef = useRef<HTMLInputElement | null>(null); 

    const [emailError, setEmailError] = useState(''); 
    const [submitError, setSubmitError] = useState(''); 
    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const [inviteSent, setInviteSent] = useState(false); 

    function handleUserRoleChange(role: string) {
        if (role === 'Viewer' || role === 'Member') {
            setInviteSent(false); 
            setUserRole(role); 
        }
    }

    function handleEmailChange(value: string) {
        setEmail(value); 
        setInviteSent(false); 

        if (!ValidateEmail(value)) {
            setEmailError('Email is Invalid'); 
        } else {
            setEmailError(''); 
        }
    }

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault(); 
        setButtonDisabled(true); 

        if (email.trim() === '' || emailError !== '') {
            return; 
        } 

        if (boardId === undefined) {
            setSubmitError('Failed to load board data, please try again.'); 
            return; 
        }

        try {
            const request = await ApiRequestWithRefreshTokenAttemptAndData(SendNewInvitationRequest, {
                boardId: boardId,
                invitedUserEmail: email,
                role: userRole
            }); 

            if (request.ok) {
                setInviteSent(true); 
                setSubmitError(''); 
                setEmail(''); 
            } else if (request.error === 'Unauthorized') {
                setSessionExpired(true); 
                setInviteSent(false); 
            } else if (request.error === 'Conflict') {
                setSubmitError('This user already has access to the board, to change user role please open Manage members panel'); 
            } else if (request.error === 'TooManyRequests') {
                setSubmitError('Please wait 5 min before sending another invitation'); 
            } else {
                setInviteSent(false); 
                setSubmitError('Failed to send invitation, please try again.'); 
            }
        } finally {
            setButtonDisabled(false); 
        }
    }

    function disableShareButton() {
        if (buttonDisabled || inviteSent) {
            return true; 
        } else if (email.trim() === '' || emailError !== '') {
            return true; 
        } else {
            return false; 
        }
    }

    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus(); 
        }
    }, []);

    return (
        <BigHoverPanel title='Share Board' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                <form onSubmit={handleFormSubmit}>
                    <div className={styles.error}>{submitError}</div>
                    <div className={styles.formContent}> 
                        <FormInput inputRef={emailInputRef}
                            className={styles.emailInput} label={'Email'} placeholder='User Email' maxLength={200} 
                            value={email} error={emailError} type={'text'} setValue={handleEmailChange} />
                        <div className={styles.roleOptionsAndShareButton}> 
                            <div className={styles.roleGiven}>
                                <span>Role:</span>
                                <select name='role' value={userRole} onChange={e => handleUserRoleChange(e.target.value)}>
                                    {availalbeRoles.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                            </div>
                            <button type='submit' className='button blue' disabled={disableShareButton()}>Share</button>
                        </div>
                    </div>
                    <div className={styles.invitationSentMessage}>
                        { inviteSent && <div>If an account exists, an invitation has been sent.</div> }
                    </div>
                </form>
            </div>
        </BigHoverPanel>
    ); 
}