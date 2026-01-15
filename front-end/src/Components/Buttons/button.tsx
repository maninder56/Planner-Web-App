'use client'

import { ButtonColourType } from "@/Types/buttonTypes";

export default function Button({
    name, 
    color, 
    disabled,
    onClick, 
}: {
    name: string; 
    color: ButtonColourType; 
    disabled?: boolean; 
    onClick: () => void | Promise<void>; 
}) {
    return (
        <button
            className={`button ${color}`}
            disabled={disabled}
            onClick={onClick}
            type="button">
                {name}
        </button>
    ); 
}