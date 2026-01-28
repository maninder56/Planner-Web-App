'use client'

import IconButton from '@/Components/Buttons/iconButton';
import { panelType } from '@/Types/UIState';
import { useState } from 'react';
import SearchBar from './components/Search/searchBar';
import ProfileIcon from './components/ProfileIcon/profileIcon';
import ProfileInfo from './components/ProfileInfo/profileInfo';
import ProfileOptions from './components/ProfileOptions/ProfileOptions';
import ClosePanelButton from '@/Components/Buttons/closePanelButton';
import InnerPanelButton from '@/Components/Buttons/innerPanelButton';
import HoverPanel from '@/Components/HoverPanels/hoverPanel';
import DashboardMenu from './components/DashboardMenu/dashboardMenu';

export default function Dashboard() {

    const [activePanel, setActivePanel] = useState<panelType>('none'); 

    return (
        <div
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('none'); 
            }}>
            <IconButton iconSrc='/plusSign.svg' name='New Board' alt='New board icon' color='blue' onClick={() => {}} />
            <IconButton iconSrc='/star.svg' alt='Favorite baord icon' color='transparent' onClick={() => {}} />
            <IconButton iconSrc='/switchBoard.svg' name='Switch Board' alt='Switch board icon' color='grey' onClick={() => {}} />
            <SearchBar activePanel={activePanel} setActivePanel={setActivePanel} />
            <ProfileIcon colour='blue' userName='Samila haka' />
            <DashboardMenu activePanel={activePanel} setActivePanel={setActivePanel} />
            <ProfileIcon colour='red' userName='chester ronal' />
            <div style={{width: '100px', height: '100px', display: 'flex', fontSize: '2rem'}}>
                <ProfileIcon colour='green' userName='isabella victoria' />
            </div>
            <ProfileInfo userName='Kevin Venoki' userEmail='kevin234@gmail.com' iconColour='red'/>  
            <ProfileOptions userName='Rice Kevin' userEmail='ricekevin@gmail.com' iconColour='red' activePanel={activePanel} setActivePanel={setActivePanel} />
        </div>
    ); 
}