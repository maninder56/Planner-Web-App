import { CardId } from "../Store/boardStore";


/**
 * Returns numeric value from CardId, or -1 if conversion fails.
 * @param cardId
 * @returns number
 */

export function ConvertCardIdToNumeric(cardId: CardId): number {
    const indexOfHyphen = cardId.lastIndexOf('-'); 
    if (indexOfHyphen === -1) {
        return -1;
    }

    const id = parseInt(cardId.slice(indexOfHyphen + 1)); 

    if (Number.isNaN(id)) {
        return -1; 
    } else {
        return id; 
    }
}


export function ConvertCardIdArrayToNumericArray(array: CardId[]): number[] | undefined {
    const numberArray: number[] = []; 

    for (const id of array) {
         const idAsNumber = ConvertCardIdToNumeric(id)
        if (idAsNumber === -1) {
            return undefined; 
        }
        numberArray.push(idAsNumber)
    }

    return numberArray; 
}