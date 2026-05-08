'use client'

import { useSearchParams } from 'next/navigation';

import styles from './page.module.css'; 
import { FormEvent, useState } from 'react';
import { ValidatePassword } from '@/Utilities/validations';
import FormInput from '@/Components/Inputs/formInput';
import PasswordchangedDialogBox from '@/app/profile/changepassword/components/passwordChangedDialogBox';


interface errorsInterface {
    newPasswordError?: string; 
    repeatNewPasswordError?: string; 
}


export default function ResetPassword() {
    const searchParams = useSearchParams(); 
    const email = searchParams.get('email'); 
    const token = searchParams.get('token'); 

    const [newPassword, setNewPassword] = useState(''); 
    const [repeatNewPassword, setRepeatNewPassword] = useState(''); 

    const [passwordChangedSuccessfully, setPasswordChangedSuccessfully] = useState(false); 
    const [formErrors, setFormErrors] = useState<errorsInterface>({}); 
    const [formSubmitError, setFormSubmitError] = useState(''); 
    const [buttonsDisabled, setButtonsDisabled] = useState(false); 

    const emailAndTokenExists = email && token; 

    function validateNewPassword(value: string): string | undefined {
        const valueTrimmed = value.trim(); 
        if (valueTrimmed === '') {
            return 'New password is Required'; 
        } else if (!ValidatePassword(value)) {
            return 'Your password is not strong, Please provide atleast 8 characters with number, capital and small letters'; 
        } else {
            return undefined; 
        }
    }

    function validateRepeatNewPassword(value: string): string | undefined {
        const valueTrimmed = value.trim(); 
        if (valueTrimmed === '') {
            return 'Please Retype your new password'; 
        } else if (value !== newPassword) {
            return 'Password does not match'; 
        } else {
            return undefined; 
        }
    }

    function validateFormValues() {
        const errors: errorsInterface = {};

        errors.newPasswordError = validateNewPassword(newPassword);
        errors.repeatNewPasswordError = validateRepeatNewPassword(repeatNewPassword);;
        
        setFormErrors(errors);

        for(let value of Object.values(errors)) {
            if (typeof(value) === 'string') {
                return false; 
            }
        }

        return true; 
    }

    function disableSubmitButton() {
        if (buttonsDisabled) return true; 

        const hasEmptyFields =
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
            // const result = await ApiRequestWithRefreshTokenAttemptAndData(ChangeUserPasswordRequest, 
            //     { oldPassword: oldPassword, newPassword: newPassword}); 
            // if (result.ok) {
            //     setPasswordChangedSuccessfully(true); 
            // } else if (result.error === 'Unauthorized') {
            //     setSessionExpired(true); 
            // } else if (result.error === 'BadRequest') {
            //     setFormSubmitError('Invalid password'); 
            // } else {
            //     setFormSubmitError('Failed to update password, Please try again'); 
            // }

            await new Promise(r => setTimeout(r, 2000)); 
            setPasswordChangedSuccessfully(true); 


        } finally {
            setButtonsDisabled(false); 
        }
    }

    if (!emailAndTokenExists) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.errorCard}>
                    <h1>Invalid Link</h1>
                    <p>This password reset link is invalid or expired.</p>
                </div>
            </div>
        ); 
    }

    return (
        <div className={styles.wrapper}>
            <header>
                <h1>Reset Password</h1>
                <p>Please Enter your new password</p>
            </header>
            <form onSubmit={handleSubmit}>
                <p>{formSubmitError}</p>
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
                            setFormErrors({...formErrors, repeatNewPasswordError: validateRepeatNewPassword(value)}); 
                        }}/>
                </div>
                <div className={styles.submitButton}>
                    <button className='button blue' type="submit" disabled={disableSubmitButton()}>
                        Update Password
                    </button>
                </div>
            </form>
            {passwordChangedSuccessfully && <PasswordchangedDialogBox /> }
        </div>
    ); 
}
