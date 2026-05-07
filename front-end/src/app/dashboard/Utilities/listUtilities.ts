import { ListId } from "../Store/boardStore";



/**
 * Returns numeric value from ListId, or -1 if conversion fails.
 * @param listId 
 * @returns number
 */

export function ConvertListIdToNumeric(listId: ListId): number {
    const indexOfHyphen = listId.lastIndexOf('-'); 
    if (indexOfHyphen === -1) {
        return -1;
    }

    const id = parseInt(listId.slice(indexOfHyphen + 1)); 

    if (Number.isNaN(id)) {
        return -1; 
    } else {
        return id; 
    }
}