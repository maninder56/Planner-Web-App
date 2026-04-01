import { profileColour } from "../Types/UIState";

export function GetRandomUserProfileColour(numberOfColours: number): profileColour {
    const randomNumber = Math.floor(Math.random() * numberOfColours); 

    switch (randomNumber) {
        case 0 : 
        return 'red'; 

        case 1 : 
        return 'blue'; 

        case 2 : 
        default: 
        return 'green'; 
    }
}