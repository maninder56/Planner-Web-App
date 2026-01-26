'use client'

import IconButton from '@/Components/Buttons/iconButton';
import { panelType } from '@/Types/UIState';
import { useState } from 'react';
import SearchBar from './components/Search/searchBar';
import ProfileIcon from './components/ProfileIcon/profileIcon';
import ProfileInfo from './components/ProfileInfo/profileInfo';

export default function Dashboard() {

    const [activePanel, setActivePanel] = useState<panelType>('none'); 

    return (
        <div
        style={{backgroundColor: 'lightgreen'}}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('none'); 
            }}>
            <IconButton iconSrc='/plusSign.svg' name='New Board' alt='New board icon' color='blue' onClick={() => {}} />
            <IconButton iconSrc='/star.svg' alt='Favorite baord icon' color='transparent' onClick={() => {}} />
            <IconButton iconSrc='/switchBoard.svg' name='Switch Board' alt='Switch board icon' color='grey' onClick={() => {}} />
            <SearchBar activePanel={activePanel} setActivePanel={setActivePanel} />
            <ProfileIcon colour='blue' userInitials='SN' />
            <ProfileIcon colour='red' userInitials='HS' />
            <ProfileIcon colour='green' userInitials='IS' />
            <ProfileInfo userInitials='KV' userName='Kevin Venoki' userEmail='kevin234@gmail.com' />    
        </div>
    ); 
}