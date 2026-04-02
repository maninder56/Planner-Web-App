import HoverConfirmation from '@/Components/HoverConfirmation/hoverConfirmation';
import styles from './deleteAccountDialogBox.module.css'; 
import { ApiRequestWithRefreshTokenAttempt } from '@/Services/ApiRequest';
import { DeleteUserProfileRequest } from '@/Services/userService';
import { useState } from 'react';
import { permanentRedirect } from 'next/navigation';
import { AppRoute } from '@/Types/appRoutes';


export default function DeleteAccountDialogBox({
    onCancle, 
}: {
    onCancle: () => void; 
}) {

    // need to add session expired property to change and set

    const [confirmError, setConfirmError] = useState(''); 
    const homeRoute: AppRoute = '/'; 

    async function handleConfirm() {
        const result = await ApiRequestWithRefreshTokenAttempt(DeleteUserProfileRequest); 
        if (result.ok) {
            permanentRedirect(homeRoute); 
        } else if (result.error === 'Unauthorized') {
            // set session expired to true
            setConfirmError('Request failed, plesae try again'); 
        } else {
            setConfirmError('Request failed, plesae try again'); 
        }
    }

    return (
        <HoverConfirmation 
            title='Delete Account' 
            message='All your account information will be permanently deleted. This action is irreversible and all data associated with user will be removed from our systems.'
            onCancel={onCancle}
            onConfirmName='Delete'
            onConfirm={handleConfirm} 
            confirmationError={confirmError} /> 
    ); 
}