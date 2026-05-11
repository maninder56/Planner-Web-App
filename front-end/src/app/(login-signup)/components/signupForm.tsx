

import styles from '@/app/(login-signup)/components/signupForm.module.css'; 
import FormInput from '@/Components/Inputs/formInput';
import { AppRoute } from '@/Types/appRoutes';
import { ValidateEmail, ValidateNewEmail, validateNewPassword, ValidatePassword, validateRepeatNewPassword } from '@/Utilities/validations';
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
    onSubmit: (useData: { name: string; email: string; password: string; }) => Promise<void>; 
    formError?: string; 
}) {

    const [userName, setUserName] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [repeatPassword, setRepeatPassword] = useState(''); 
    const [errors, setErrors] = useState<errorsInterface>({}); 
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false); 

    const logInRoute: AppRoute = '/login'; 

    function validateFormValues(): boolean {
        const newErrors: errorsInterface = {}; 
        newErrors.userName = validateUserName(userName); 
        newErrors.email = ValidateNewEmail(email); 
        newErrors.password = validateNewPassword(password); 
        newErrors.repeatPassword = validateRepeatNewPassword(repeatPassword, password); 


        setErrors(newErrors);

        for(let value of Object.values(newErrors)) {
            if (typeof(value) === 'string') {
                return false; 
            }
        }

        return true; 
    }

    function validateUserName(value: string): string | undefined {
        const valueTrimmed = value.trim(); 
        if (valueTrimmed === '') {
            return 'User Name is Required'; 
        } else {
            return undefined; 
        }
    }


    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault(); 
        setButtonsDisabled(true); 

        try {
            if (validateFormValues()) {
                await onSubmit({name: userName, email: email, password: password});  
            }
        } finally {
            setButtonsDisabled(false); 
        }
    }

    return (
        <form className={styles.form} onSubmit={handleFormSubmit}>
            <header>Sign up to continue</header>
            <div className={styles.formError}>{formError}</div>
            <div className={styles.inputContainer}>
                <FormInput label='User Name' placeholder='Your Name' 
                    maxLength={100} value={userName} error={errors.userName} type='text'
                    setValue={(value) => {
                        setUserName(value); 
                        setErrors({...errors, userName: validateUserName(value)}); 
                    }}/>
            </div>
            <div className={styles.inputContainer}>
                <FormInput label='Email' placeholder='Enter your Email'
                     maxLength={200} value={email} error={errors.email} type='text'
                    setValue={(value) => {
                        setEmail(value); 
                        setErrors({...errors, email: ValidateNewEmail(value) }); 
                    }}/>
            </div>
            <div className={styles.inputContainer}>
                <FormInput label='Password' placeholder='New Password' 
                    maxLength={100} value={password} error={errors.password} type='password'
                    setValue={(value) => {
                        setPassword(value); 
                        setErrors({...errors, password: validateNewPassword(value)}); 
                    }}/>
            </div>
            <div className={styles.inputContainer}>
                <FormInput label='Repeat Password' placeholder='Repeat Password' 
                    maxLength={100} value={repeatPassword} error={errors.repeatPassword} type='password'
                    setValue={(value) => {
                        setRepeatPassword(value); 
                        setErrors({...errors, repeatPassword: validateRepeatNewPassword(value, password)}); 
                    }}/>
            </div>
            <div className={styles.LoginLink}>
                <Link href={logInRoute} className={buttonsDisabled ? styles.linkDisabled : undefined }
                    onClick={e => {
                        if (buttonsDisabled) {
                            e.preventDefault(); 
                        }
                    }}
                >
                    Already have an account? Log in
                </Link>
            </div>
            <div className={styles.signup}>
                <button type='submit' className='button red' disabled={buttonsDisabled}>Sign up</button>
            </div>
        </form>
    ); 
}