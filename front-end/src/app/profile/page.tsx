'use client'

import { useUserStore } from '@/Store/userStore';
import styles from './page.module.css'; 
import { useEffect, useState } from 'react';
import FormInput from '@/Components/Inputs/formInput';
import Loading from './loading';
import Button from '@/Components/Buttons/button';
import Link from 'next/link';
import { AppRoute } from '@/Types/appRoutes';
import { useBoardStore } from '../dashboard/Store/boardStore';
import { useBoardUIStore } from '../dashboard/Store/boardUIStore';


interface errorsInterface {
    userName?: string; 
    formSubmitError?: string; 
}

export default function Page () {
    const userData = useUserStore((state) => state.userData); 
    const setUserData = useUserStore((state) => state.setUserData); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const [loading, setLoading] = useState(true); 
    const [userName, setUserName] = useState(userData?.name ?? ''); 
    const [fromErrors, setFormErrors] = useState<errorsInterface>({}); 
    const [buttonsDisabled, setButtonsDisabled] = useState(false); 

    const changePasswordRoute: AppRoute = '/changepassword'; 
    const dashboardRoute: AppRoute = '/dashboard'; 

    function handleFormSubmit() {

    }

    async function fetchData() {
        setLoading(true); 

        try {
            await new Promise(r => setTimeout(r, 5000)); 
        } finally {
            setLoading(false)
        }
    }; 

    useEffect(() => {
        setActivePanel('none'); 
    })


    if (loading && userData === undefined) {
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
            </div>
        ); 
    }

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleFormSubmit}>
                <header>Profile</header>
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
                <div>
                    <button className='button blue' type='submit' 
                        disabled={buttonsDisabled || userName === userData.name}
                    >Save</button>
                </div>
                <Link className={[styles.changePassword, 'button blue'].join(' ')} href={changePasswordRoute}>Change Password</Link>
                <div>
                    <Button name='Delete Account' color='red' disabled={buttonsDisabled} onClick={() => { }} />
                </div>
                <Link href={dashboardRoute} className={[styles.dashboardLink, 'button transparent light-outline'].join(' ')}>Dashboard</Link>
            </form>
        </div>
    ); 
}