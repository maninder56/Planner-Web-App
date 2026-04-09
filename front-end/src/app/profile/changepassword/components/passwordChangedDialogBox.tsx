import HoverConfirmation from '@/Components/HoverConfirmation/hoverConfirmation';
import { AppRoute } from '@/Types/appRoutes';
import { permanentRedirect } from 'next/navigation';

export default function PasswordchangedDialogBox() {
    const logInRoute: AppRoute = '/login'; 
    return (
        <HoverConfirmation
            title='Password changed successfully'
            message='You password has been updated, please login with your new password.'
            onConfirmName='Login' 
            onConfirm={() => {
                permanentRedirect(logInRoute); 
            }} />
    ); 
}