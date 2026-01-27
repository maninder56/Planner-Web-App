'use client'

import Image from 'next/image';


export default function ClosePanelButton({
    onClick,
}: {
    onClick: () => void; 
}) {
    return (
        <button
            className='closePanelButton'
            onClick={onClick}
            type='button'>
            <Image src={'./Cross-sign.svg'} width={50} height={50} alt='close button icon' />
        </button>
    ); 
}