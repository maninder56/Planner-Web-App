'use client'

import { useUserStore } from '@/Store/userStore';
import styles from './page.module.css'; 
import { FormEvent, useEffect, useState } from 'react';
import FormInput from '@/Components/Inputs/formInput';
import Loading from './loading';
import Button from '@/Components/Buttons/button';
import Link from 'next/link';
import { AppRoute } from '@/Types/appRoutes';
import { useBoardStore } from '../dashboard/Store/boardStore';
import { useBoardUIStore } from '../dashboard/Store/boardUIStore';
import { ApiRequestWithRefreshTokenAttempt, ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateUserNameRequest, UserProfileDataRequest } from '@/Services/userService';
import { permanentRedirect, useRouter } from 'next/navigation';
import DeleteAccountDialogBox from './components/deleteAccountDialogBox/deleteAccountDialogBox';
import SessionExpired from '@/Components/Alert/SessionExpired/sessionExpired';


interface errorsInterface {
    userName?: string; 
    formSubmitError?: string; 
}

export default function Page () {
    const userData = useUserStore((state) => state.userData); 
    const setUserData = useUserStore((state) => state.setUserData); 
    const sessionExpired = useUserStore((state) => state.sessionExpired); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const router = useRouter(); 

    const [loading, setLoading] = useState(true); 
    const [userName, setUserName] = useState(''); 
    const [fromErrors, setFormErrors] = useState<errorsInterface>({}); 
    const [buttonsDisabled, setButtonsDisabled] = useState(false); 
    const [showDeleteDialogBox, setShowDeleteDialogBox] = useState(false); 

    const changePasswordRoute: AppRoute = '/profile/changepassword'; 
    const dashboardRoute: AppRoute = '/dashboard'; 

    function validateFormValues() {
        let error: string | undefined = undefined; 
        const name = userName.trim(); 

        if (userData === undefined) {
            return false; 
        }

        if (name === '') {
            error = 'User name is Required'; 
        } else if (name === userData?.name) {
            error = 'User name is unchanged'; 
        }

        setFormErrors({...fromErrors, userName: error}); 
        return error === undefined; 
    }

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault(); 
        setButtonsDisabled(true); 

        try {
            if (validateFormValues() && userData !== undefined) {
                const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateUserNameRequest, userName); 
                if (request.ok) {
                    setUserData({name: userName, email: userData.email}); 
                } else if (request.error === 'Unauthorized') {
                    setSessionExpired(true);
                } else {
                    setFormErrors({...fromErrors, formSubmitError: 'Failed to update user profile, please try again'}); 
                }
            }

        } finally {
            setButtonsDisabled(false); 
        }
    }

    async function fetchData() {
        setLoading(true); 

        try {
            const result = await ApiRequestWithRefreshTokenAttempt(UserProfileDataRequest); 
            if (result.ok && result.data !== undefined) {
                setUserData(result.data); 
                setUserName(result.data.name); 
            } else if (!result.ok && result.error === 'Unauthorized') {
                setSessionExpired(true); 
                setUserData(undefined); 
            } else {
                setUserData(undefined); 
                await new Promise(r => setTimeout(r, 1000)); 
            }

        } finally {
            setLoading(false)
        }
    }; 

    useEffect(() => {
        setActivePanel('none'); 

        if (!userData) {
            fetchData(); 
        } else {
            setUserName(userData.name); 
            setLoading(false); 
        }
    }, [])


    if (loading) {
        return (
            <div className={styles.wrapper}>
                <Loading />
            </div>
        ); 
    }

    if (userData === undefined) {
        return (
            <div className={styles.userDataFailedToLoad}>
                <p>Failed to load user data</p>
                <Button name='Try again' color='red' disabled={buttonsDisabled} onClick={fetchData} />
                {sessionExpired && <SessionExpired /> }
            </div>
        ); 
    }

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleFormSubmit}>
                <header className={styles.profileHeader}>Profile</header>
                <div className={styles.formError}>{fromErrors.formSubmitError}</div>
                <FormInput label='User Name' placeholder='Your Name' maxLength={100} value={userName} error={fromErrors.userName} type='text'
                    setValue={(value) => {
                        setUserName(value); 
                        if (value === '') {
                            setFormErrors({...fromErrors, userName: 'User name is Required'}); 
                        } else {
                            setFormErrors({...fromErrors, userName: undefined}); 
                        }
                    }}/>
                <div className={styles.fromElement}>
                    <header>Email</header>
                    <p>{userData.email}</p>
                </div>
                <button className={[styles.saveButton, 'button blue'].join(' ')} type='submit' 
                    disabled={buttonsDisabled || userName.trim() === userData.name || userName.trim() === ''}
                >Save</button>
                <div className={styles.changePassword}>
                    <Button name='Change Password' color='blue' disabled={buttonsDisabled} onClick={() => {
                        router.push(changePasswordRoute); 
                     }} />
                </div>
                <div className={styles.deleteAccount}>
                    <Button name='Delete Account' color='red' disabled={buttonsDisabled} onClick={() => setShowDeleteDialogBox(true)} />
                </div>
            </form>
            {sessionExpired && <SessionExpired /> }
            {showDeleteDialogBox && <DeleteAccountDialogBox onCancle={() => setShowDeleteDialogBox(false)} />}
        </div>
    ); 
}