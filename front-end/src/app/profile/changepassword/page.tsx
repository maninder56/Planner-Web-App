'use client'

import FormInput from '@/Components/Inputs/formInput';
import styles from './page.module.css'; 
import Loading from '../loading';
import { FormEvent, useEffect, useState } from 'react';
import { useUserStore } from '@/Store/userStore';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { AppRoute } from '@/Types/appRoutes';
import { validateNewPassword, validateOldPassword, ValidatePassword, validateRepeatNewPassword } from '@/Utilities/validations';
import Button from '@/Components/Buttons/button';
import { permanentRedirect, useRouter } from 'next/navigation';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { ChangeUserPasswordRequest } from '@/Services/userService';
import PasswordchangedDialogBox from './components/passwordChangedDialogBox';
import SessionExpired from '@/Components/Alert/SessionExpired/sessionExpired';

interface errorsInterface {
    oldPasswordError?: string; 
    newPasswordError?: string; 
    repeatNewPasswordError?: string; 
}


export default function Page () {
    const sessionExpired = useUserStore((state) => state.sessionExpired); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const router = useRouter(); 

    const [oldPassword, setOldPassword] = useState(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [repeatNewPassword, setRepeatNewPassword] = useState(''); 

    const [formErrors, setFormErrors] = useState<errorsInterface>({}); 
    const [formSubmitError, setFormSubmitError] = useState(''); 
    const [buttonsDisabled, setButtonsDisabled] = useState(false); 
    const [passwordChangedSuccessfully, setPasswordChangedSuccessfully] = useState(false); 

    const profileRoute: AppRoute = '/profile'; 

    function validateFormValues() {
        const errors: errorsInterface = {};
        errors.oldPasswordError =  validateOldPassword(oldPassword);
        errors.newPasswordError = validateNewPassword(newPassword);
        errors.repeatNewPasswordError = validateRepeatNewPassword(repeatNewPassword, newPassword);;
        
        setFormErrors(errors);

        for(let value of Object.values(errors)) {
            if (typeof(value) === 'string') {
                return false; 
            }
        }

        return true; 
    }

    function disableSaveButton() {
        const hasEmptyFields =
            oldPassword === '' ||
            newPassword === '' ||
            repeatNewPassword === '';
        
        if (hasEmptyFields) return true;

        for(let value of Object.values(formErrors)) {
            if (typeof(value) === 'string') {
                return true; 
            }
        }

        return false; 
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault(); 

        if (!validateFormValues()) return; 

        setButtonsDisabled(true); 

        try {
            const result = await ApiRequestWithRefreshTokenAttemptAndData(ChangeUserPasswordRequest, 
                { oldPassword: oldPassword, newPassword: newPassword}); 
            if (result.ok) {
                setPasswordChangedSuccessfully(true); 
            } else if (result.error === 'Unauthorized') {
                setSessionExpired(true); 
            } else if (result.error === 'BadRequest') {
                setFormSubmitError('Invalid password'); 
            } else {
                setFormSubmitError('Failed to update password, Please try again'); 
            }
        } finally {
            setButtonsDisabled(false); 
        }
    }

    useEffect(() => {
        setActivePanel('none'); 
    }, []); 

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleSubmit}>
                <header className={styles.pageTitle}>Change Password</header>
                <div className={styles.formError}>{formSubmitError}</div>
                <div className={styles.inputContainer}>
                    <FormInput label='Old Password' placeholder='Old Password' maxLength={100} value={oldPassword}
                        error={formErrors.oldPasswordError} type='password'
                        setValue={(value) => {
                            setOldPassword(value); 
                            setFormErrors({...formErrors, oldPasswordError: validateOldPassword(value)}); 
                        }}/>
                </div>
                <div className={styles.inputContainer}>
                    <FormInput label='New Password' placeholder='New Password' maxLength={100} value={newPassword} 
                        error={formErrors.newPasswordError} type='password'
                        setValue={(value) => {
                            setNewPassword(value); 
                            setFormErrors({...formErrors, newPasswordError: validateNewPassword(value)}); 
                        }}/>
                </div>
                <div className={styles.inputContainer}>
                    <FormInput label='Repeat Password' placeholder='Repeat Password' maxLength={100} value={repeatNewPassword} 
                        error={formErrors.repeatNewPasswordError} type='password'
                        setValue={(value) => {
                            setRepeatNewPassword(value); 
                            setFormErrors({...formErrors, repeatNewPasswordError: validateRepeatNewPassword(value, newPassword)}); 
                        }}/>
                </div>
                <div className={styles.buttons}>
                    <Button name='Cancel' color='transparent-with-outline' disabled={buttonsDisabled} onClick={() => {
                        router.push(profileRoute); 
                    }} />
                    <button className={[styles.saveButton, 'button blue'].join(' ')} type='submit'
                        disabled={buttonsDisabled || disableSaveButton()}
                    >Save</button>
                </div>
            </form>
            {sessionExpired && <SessionExpired />}
            {passwordChangedSuccessfully && <PasswordchangedDialogBox /> }
        </div>
    ); 
}