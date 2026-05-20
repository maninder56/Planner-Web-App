
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
            } else if (request.error === 'Conflict') {
                setSubmitError('This user already has access to the board, to change user role please go to Manage members panel.'); 
            } else if (request.error === 'TooManyRequests') {
                setSubmitError('Please wait 5 min before sending another invitation.'); 
            } else {
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
                <div className={styles.manageMembers}>
                    <button disabled={buttonDisabled} onClick={e => {
                        e.stopPropagation(); 
                        setActivePanel('manageMembersOptions'); 
                    }}>
                        {/* members logo */}
                        <svg fill="#000000" width="50" height="50" viewBox="0 0 549.907 549.908">
                            <g>
                                <path d="M110.534,220.962c0-49.027,39.741-88.768,88.768-88.768s88.768,39.741,88.768,88.768c0,49.026-39.741,88.768-88.768,88.768
                                    S110.534,269.989,110.534,220.962z M236.968,315.783h-75.327c-62.668,0-113.655,50.986-113.655,113.646v92.143l0.236,1.437
                                    l6.36,1.985c59.796,18.679,111.764,24.914,154.531,24.914c83.531,0,131.94-23.82,134.938-25.333l5.94-3.015l0.626,0.006v-92.137
                                    C350.617,366.769,299.631,315.783,236.968,315.783z M350.617,177.533c49.024,0,88.768-39.741,88.768-88.768
                                    C439.385,39.741,399.642,0,350.617,0c-49.023,0-88.768,39.741-88.768,88.765C261.85,137.792,301.594,177.533,350.617,177.533z
                                    M388.28,183.585h-75.326c-1.797,0-3.547,0.189-5.32,0.275c6.81,14.295,10.74,30.225,10.74,47.094
                                    c0,31.129-13.057,59.205-33.922,79.23c48.823,14.523,86.144,55.986,94.638,107.08c71.999-3.145,113.504-23.49,116.265-24.885
                                    l5.94-3.015l0.626,0.012v-92.137C501.933,234.575,450.946,183.585,388.28,183.585z"
                                    fill='#000000'/>
                            </g>
                        </svg>
                        <span>Manage Members</span>
                    </button>
                </div>
            </div>
        </BigHoverPanel>
    ); 
}