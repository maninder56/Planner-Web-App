import { panelType, profileColour } from '@/Types/UIState';

import styles from './profileIcon.module.css'; 
import IconButton from '@/Components/Buttons/iconButton';

export default function ProfileIcon({
    colour, 
    userInitials, 
}: {
    colour: profileColour; 
    userInitials: string; 
}) {
    return (
        <div className={[styles.wrapper, styles[colour]].join(' ')}>
            <header>{userInitials}</header>
        </div>
    ); 
}