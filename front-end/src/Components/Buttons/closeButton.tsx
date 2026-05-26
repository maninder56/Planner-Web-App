'use client'

import Image from 'next/image';


export default function CloseButton({
    onClick,
    className,
}: {
    onClick: () => void; 
    className?: string; 
}) {
    return (
        <button
            className={['closePanelButton', className].join(' ')}
            onClick={onClick}
            type='button'>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 20 4 4m16 0L4 20" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        </button>
    ); 
}