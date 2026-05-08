'use client'

import { FormEvent, useState } from 'react';
import styles from './page.module.css'; 
import FormInput from '@/Components/Inputs/formInput';
import Button from '@/Components/Buttons/button';
import Link from 'next/link';
import { AppRoute } from '@/Types/appRoutes';
import { ForgotPasswordRequest } from '@/Services/userService';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState('');
    const [emailError, setEmailError] = useState('');
    
    const logInRoute: AppRoute = '/login'; 
    
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setFormError('');

        try {
            const request = await ForgotPasswordRequest(email); 

            if (request.ok) {
                setSubmitted(true);
            } else {
                setFormError('Failed to send email. Please try again.'); 
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <header>
                <h1>Forgot your password?</h1>
                <p>Enter your email address and we’ll send you a reset link.</p>
            </header>
            {submitted ? (
                <div className={styles.success}>
                    <p>If an account exists for that email, a password reset link has been sent.</p>
                    <Link href={logInRoute} className='button red'>Log in</Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <p className={styles.formError}>{formError}</p>
                    <FormInput label='Email' placeholder='Enter your email' className={styles.formInput}
                        maxLength={200} value={email} error={emailError} type='text'
                        setValue={(value) => {
                            setEmail(value); 
                            if (value.trim() === '') {
                                setEmailError('Email is Required'); 
                            } else {
                                setEmailError(''); 
                            }
                        }} />
                    <div className={styles.submitButton}>
                        <button className='button blue' type="submit" disabled={loading || email.trim() === ''}>
                            {loading ? 'Sending...' : 'Send reset link'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    ); 
}

