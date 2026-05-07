'use client'

import { useSearchParams } from 'next/navigation';

import styles from './page.module.css'; 
import { useState } from 'react';
import { ValidatePassword } from '@/Utilities/validations';


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

    const emailAndTokenExists = email && token; 

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

        errors.newPasswordError = validateNewPassword(newPassword);
        errors.repeatNewPasswordError = validateRepeatNewPassword(repeatNewPassword);;
        
        setFormErrors(errors); 
        return Object.keys(errors).length === 0; 
    }

    function disableSaveButton() {
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

    // if (success) {
    //     return (
    //         <div className={styles.wrapper}>
    //             <div className={styles.successCard}>
    //                 <h1>Password Updated</h1>
    //                 <p>You can now log in with your new password.</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className={styles.wrapper}>
            <header>
                <h1>Reset Password</h1>
                <p>Please Enter your new password</p>
            </header>
            <form>
                <div className={styles.inputContainer}>
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
                </div>
                <div className={styles.inputContainer}>
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
                </div>

                {/* <button
                type="submit"
                disabled={isSubmitting}
                className={styles.button}
                >
                {isSubmitting ? 'Updating...' : 'Update Password'}
                </button> */}
            </form>
            {passwordChangedSuccessfully && <PasswordchangedDialogBox /> }
        </div>
    ); 
}


/*


export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const email = searchParams.get('email');
  const token = searchParams.get('token');


  const onSubmit = async (data: FormData) => {
    setServerError('');

    if (!email || !token) {
      setServerError('Invalid reset link.');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'Unable to reset password'
      );
    }
  };


*/