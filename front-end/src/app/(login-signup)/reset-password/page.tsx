'use client'

import { useSearchParams } from 'next/navigation';

import styles from './page.module.css'; 
import { FormEvent, useState } from 'react';
import { validateNewPassword, ValidatePassword, validateRepeatNewPassword } from '@/Utilities/validations';
import FormInput from '@/Components/Inputs/formInput';
import PasswordchangedDialogBox from '@/app/profile/changepassword/components/passwordChangedDialogBox';
import { ResetPasswordRequest } from '@/Services/userService';
import { AppRoute } from '@/Types/appRoutes';
import Link from 'next/link';


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
    // const [formSubmitError, setFormSubmitError] = useState(''); 
    const [buttonsDisabled, setButtonsDisabled] = useState(false); 

    const [validLink, setValidLink] = useState<boolean>(email !== null && token !== null);

    const forgotPasswordRoute: AppRoute = '/login/forgot-password'; 

    function validateFormValues() {
        const errors: errorsInterface = {};

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
        if (!validLink || !email || !token) return; 

        setButtonsDisabled(true); 

        try {
            const result = await ResetPasswordRequest({
                email: email, token: token, newPassword: newPassword
            }); 

            if (result.ok) {
                setPasswordChangedSuccessfully(true); 
            } else {
                setValidLink(false); 
            }
        } finally {
            setButtonsDisabled(false); 
        }
    }

    if (!validLink) {
        return (
            <div className={styles.wrapper}>
                <header>
                    <h1>Invalid Link</h1>
                    <p>This password reset link is invalid or has expired.</p>
                </header>
                <div className={styles.forgotPasswordLink}>
                    <Link href={forgotPasswordRoute} className='button red'>Request another link</Link>
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
                {/* <p className={styles.formSubmitError}>{formSubmitError}</p> */}
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
