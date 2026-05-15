
import BigHoverPanel from '@/Components/HoverPanels/BigHoverPanel/bigHoverPanel';
import styles from './shareButtonOptions.module.css'; 
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import FormInput from '@/Components/Inputs/formInput';
import { FormEvent, useState } from 'react';
import { UserRole } from '@/app/dashboard/Types/boardTypes';
import { ValidateEmail } from '@/Utilities/validations';

export default function ShareButtonOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    
    const [email, setEmail] = useState(''); 
    const [userRole, setUserRole] = useState<UserRole>('Viewer'); 
    const availalbeRoles: UserRole[] = ['Viewer', 'Member']; 

    const [emailError, setEmailError] = useState(''); 
    const [submitError, setSubmitError] = useState(''); 
    const [buttonDisabled, setButtonDisabled] = useState(false); 
    const [inviteSent, setInviteSent] = useState(false); 

    function handleUserRoleChange(role: string) {
        if (role === 'Viewer' || role === 'Member') {
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

        try {
            await new Promise(r => setTimeout(r, 2000)); 
            setInviteSent(true); 
            setSubmitError('error occured')
        } finally {
            setButtonDisabled(false); 
        }
    }

    function disableShareButton() {
        if (buttonDisabled) {
            return true; 
        } else if (email.trim() === '' || emailError !== '') {
            return true; 
        } else {
            return false; 
        }
    }

    return (
        <BigHoverPanel title='Share Board' onCloseClick={() => setActivePanel('none')}>
            <div className={styles.wrapper}>
                <form onSubmit={handleFormSubmit}>
                    <div className={styles.error}>{submitError}</div>
                    <div className={styles.formContent}> 
                        <FormInput className={styles.emailInput} label={'Email'} placeholder='User Email' maxLength={200} 
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