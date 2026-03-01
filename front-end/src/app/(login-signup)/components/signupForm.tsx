

import styles from '@/app/(login-signup)/components/signupForm.module.css'; 
import FormInput from '@/Components/Inputs/formInput';
import { ValidateEmail, ValidatePassword } from '@/Utilities/validations';
import Link from 'next/link';
import { FormEvent, useState } from 'react';


interface errorsInterface {
    userName?: string; 
    email?: string; 
    password?: string; 
    repeatPassword?: string; 
}


export default function SignupForm({
    onSubmit, 
    formError, 
}: {
    onSubmit: () => Promise<void>; 
    formError?: string; 
}) {

    const [userName, setUserName] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [repeatPassword, setRepeatPassword] = useState(''); 
    const [errors, setErrors] = useState<errorsInterface>({}); 
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false); 


    function validateFormValues(): boolean {
        const newErrors: errorsInterface = {}; 

        if (userName === '') {
            newErrors.userName = 'User Name is Required'; 
        }

        if (email === '') {
            newErrors.email = 'Email is Required'; 
        } else if (!ValidateEmail(email)) {
            newErrors.email = 'Email is Invalid'; 
        }

        if (password === '') {
            newErrors.password = 'Password is Required'; 
        } else if (!ValidatePassword(password)) {
            newErrors.password = 'Your password is not strong, Please provide atleast 8 characters with number, capital and small letters'; 
        }

        if (repeatPassword === '') {
            newErrors.repeatPassword = 'Please Retype your password'
        } else if (password !== repeatPassword) {
            newErrors.repeatPassword = 'Password does not match'
        }

        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0; 

    }


    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault(); 
        setButtonsDisabled(true); 

        try {
            if (validateFormValues()) {
                await onSubmit();  
            }
        } finally {
            setButtonsDisabled(false); 
        }
    }

    return (
        <form className={styles.form} onSubmit={handleFormSubmit}>
            <header>Sign up to continue</header>
            <div className={styles.formError}>{formError}</div>
            <FormInput label='User Name' placeholder='Your Name' maxLength={100} value={userName} error={errors.userName} type='text'
                setValue={(value) => {
                    setUserName(value); 
                    if (value === '') {
                        setErrors({...errors, userName: 'User name is Required'}); 
                    } else {
                        setErrors({...errors, userName: undefined}); 
                    }
                }}/>
            <FormInput label='Email' placeholder='Enter your Email' maxLength={200} value={email} error={errors.email} type='text'
                setValue={(value) => {
                    setEmail(value); 
                    if (value === '') {
                        setErrors({...errors, email: 'Email is Required' }); 
                    } else {
                        setErrors({...errors, email: undefined }); 
                    }
                }}/>
            <FormInput label='Password' placeholder='New Password' maxLength={100} value={password} error={errors.password} type='password'
                setValue={(value) => {
                    setPassword(value); 
                    if (!ValidatePassword(value)) {
                        setErrors({...errors, password: 'Your password is not strong, Please provide atleast 8 characters with number, capital and small letters'}); 
                    } else {
                        setErrors({...errors, password: undefined}); 
                    }
                }}/>
            <FormInput label='Repeat Password' placeholder='Repeat Password' maxLength={100} value={repeatPassword} error={errors.repeatPassword} type='password'
                setValue={(value) => {
                    setRepeatPassword(value); 
                    if (value === '') {
                        setErrors({...errors, repeatPassword: 'Please Retype your password'}); 
                    } else if (password !== value) {
                        setErrors({...errors, repeatPassword: 'Password does not match'}); 
                    } else {
                        setErrors({...errors, repeatPassword: undefined}); 
                    }
                }}/>
            <div className={styles.LoginLink}>
                <Link href={'/login'}>Already have an account? Log in</Link>
            </div>
            <div className={styles.signup}>
                <button type='submit' className='button red' disabled={buttonsDisabled}>Sign up</button>
            </div>
        </form>
    ); 
}