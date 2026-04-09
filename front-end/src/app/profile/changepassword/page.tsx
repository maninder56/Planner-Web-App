'use client'

import FormInput from '@/Components/Inputs/formInput';
import styles from './page.module.css'; 
import Loading from '../loading';
import { FormEvent, useEffect, useState } from 'react';
import { useUserStore } from '@/Store/userStore';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { AppRoute } from '@/Types/appRoutes';
import { ValidatePassword } from '@/Utilities/validations';
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

    function validateOldPassword(value: string): string | undefined {
        const valueTrimmed = value.trim(); 
        if (valueTrimmed === '') {
            return 'Old password is Required'; 
        } else {
            return undefined; 
        }
    }

    function validateNewPassword(value: string): string | undefined {
        const valueTrimmed = value.trim(); 
        if (valueTrimmed === '') {
            return 'New password is Required'; 
        } else if (!ValidatePassword(valueTrimmed)) {
            return 'Your password is not strong, Please provide atleast 8 characters with number, capital and small letters'; 
        } else {
            return undefined; 
        }
    }

    function validateRepeatNewPassword(value: string): string | undefined {
        const valueTrimmed = value.trim(); 
        if (valueTrimmed === '') {
            return 'Please Retype your new password'; 
        } else if (valueTrimmed !== newPassword) {
            return 'Password does not match'; 
        } else {
            return undefined; 
        }
    }

    function validateFormValues() {
        const errors: errorsInterface = {};

        const oldPasswordValidation = validateOldPassword(oldPassword);
        if (oldPasswordValidation) {
            errors.oldPasswordError = oldPasswordValidation;
        }

        const newPasswordValidation = validateNewPassword(newPassword);
        if (newPasswordValidation) {
            errors.newPasswordError = newPasswordValidation;
        }

        const repeatValidation = validateRepeatNewPassword(repeatNewPassword);
        if (repeatValidation) {
            errors.repeatNewPasswordError = repeatValidation;
        }

        setFormErrors(errors); 
        return Object.keys(errors).length === 0; 
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
                <FormInput label='Old Password' placeholder='Old Password' maxLength={100} value={oldPassword}
                    error={formErrors.oldPasswordError} type='password'
                    setValue={(value) => {
                        setOldPassword(value); 
                        const validationResult = validateOldPassword(value); 
                        if (validationResult !== undefined) {
                            setFormErrors({...formErrors, oldPasswordError: validationResult}); 
                        } else {
                            setFormErrors({...formErrors, oldPasswordError: undefined}); 
                        }
                    }}/>
                <FormInput label='New Password' placeholder='New Password' maxLength={100} value={newPassword} 
                    error={formErrors.newPasswordError} type='password'
                    setValue={(value) => {
                        setNewPassword(value); 
                        const validationResult = validateNewPassword(value); 
                        if (validationResult !== undefined) {
                            setFormErrors({...formErrors, newPasswordError: validationResult}); 
                        } else {
                            setFormErrors({...formErrors, newPasswordError: undefined}); 
                        }
                    }}/>
                <FormInput label='Repeat Password' placeholder='Repeat Password' maxLength={100} value={repeatNewPassword} 
                    error={formErrors.repeatNewPasswordError} type='password'
                    setValue={(value) => {
                        setRepeatNewPassword(value); 
                        const validationResult = validateRepeatNewPassword(value); 
                        if (validationResult !== undefined) {
                            setFormErrors({...formErrors, repeatNewPasswordError: validationResult}); 
                        } else {
                            setFormErrors({...formErrors, repeatNewPasswordError: undefined}); 
                        }
                    }}/>
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