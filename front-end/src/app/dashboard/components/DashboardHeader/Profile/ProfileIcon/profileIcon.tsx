import { profileColour } from '@/app/dashboard/Types/UIState';

import styles from './profileIcon.module.css'; 

export default function ProfileIcon({
    colour, 
    userName, 
}: {
    colour: profileColour; 
    userName: string; 
}) {
    function getUserInitials() {
        try {
            const name = userName; 
            const nameArray = name.toUpperCase()
                .trim()
                .split(/\s+/)
                .filter(w => w.length > 0); 
            if (nameArray.length === 0) {
                return 'U'; 
            } else if (nameArray.length === 1) {
                return nameArray[0][0]; 
            } else {
                return nameArray[0][0] + nameArray[nameArray.length - 1][0]; 
            }
        } catch {
            console.error('Failed to get user Initials'); 
            return 'U'; 
        }
    }
    return (
        <div className={[styles.wrapper, styles[colour]].join(' ')}>
            <header>{getUserInitials()}</header>
        </div>
    ); 
}