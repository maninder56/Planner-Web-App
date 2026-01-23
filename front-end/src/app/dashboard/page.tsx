'use client'

import IconButton from '@/Components/Buttons/iconButton';

export default function Dashboard() {
    return (
        <div>
            <IconButton iconSrc='/plusSign.svg' name='New Board' alt='New board icon' color='blue' onClick={() => {}} />
            <IconButton iconSrc='/star.svg' alt='Favorite baord icon' color='transparent' onClick={() => {}} />
            <IconButton iconSrc='/switchBoard.svg' name='Switch Board' alt='Switch board icon' color='grey' onClick={() => {}} />
        </div>
    ); 
}