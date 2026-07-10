
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './boardMenuOptions.module.css'; 
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import { BoardColour, UserRole } from '@/app/dashboard/Types/boardTypes';
import { BoardColoursList } from '@/app/dashboard/Utilities/boardColours';
import { useState } from 'react';
import Button from '@/Components/Buttons/button';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useUserStore } from '@/Store/userStore';
import { ApiRequestWithRefreshTokenAttemptAndData } from '@/Services/ApiRequest';
import { UpdateBoardInfoRequest } from '@/app/dashboard/Services/boardService';
import DeleteBoardDialogBox from './DeleteBoardDialogBox/deleteBoardDialogBox';

export default function BoardMenuOptions({
    boardId, 
    userRole,
}: {
    boardId: number; 
    userRole: UserRole; 
}) {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    const boardColour = useBoardStore((state) => state.currentBoardData?.boardColour); 
    const setBoardColour = useBoardStore((state) => state.setCurrentBoardColour); 
    const favouriteBoard = useBoardStore((state) => state.currentBoardData?.idFavouriteBoard); 
    const setFavouriteBoard = useBoardStore((state) => state.setCurrentBoardFavourite); 
    const resetBoardArray = useBoardStore((state) => state.resetBoardArray); 
    const setBoardError = useBoardStore((state) => state.setBoardError); 
    const setSessionExpired = useUserStore((state) => state.setSessionExpired); 

    const [showDeleteBoard, setShowDeleteBoard] = useState(false);

    const availableColours: BoardColour[] = BoardColoursList; 
    
    const viewOnlyBoard = userRole === 'Viewer'; 
    const isNotOwner = userRole !== 'Owner'; 


    async function handleBoardColourChange(newColour: BoardColour) {
        if (boardColour === undefined || newColour === boardColour) {
            return; 
        }

        const oldColour = boardColour; 
        setBoardColour(newColour); 

        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateBoardInfoRequest, 
            { boardId: boardId, boardInfo: {
                name: undefined,
                isFavoriteBoard: undefined,
                backgroundColour: newColour,
            }}
        ); 

        if (request.ok) {
            setBoardError(''); 
            resetBoardArray();
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
            setBoardColour(oldColour); 
        } else {
            setBoardError('Failed to change board colour, please try again.'); 
            setBoardColour(oldColour); 
        }
    }

    async function handleFavoriteBoardButton() {
        if (favouriteBoard === undefined) {
            return; 
        }


        const nextFavorite = !favouriteBoard; 
        setFavouriteBoard(nextFavorite); 

        const request = await ApiRequestWithRefreshTokenAttemptAndData(UpdateBoardInfoRequest, 
            { boardId: boardId, boardInfo: {
                name: undefined,
                isFavoriteBoard: nextFavorite,
                backgroundColour: undefined
            }}
        ); 

        if (request.ok) {
            resetBoardArray();
            setBoardError(''); 
        } else if (request.error === 'Unauthorized') {
            setSessionExpired(true); 
            setFavouriteBoard(!nextFavorite); 
        } else {
            setBoardError('Failed to set board favourite, please try again.'); 
            setFavouriteBoard(!nextFavorite); 
        }
    }

    if (viewOnlyBoard) {
        return null; 
    }

    if (isNotOwner) {
        return (
            <HoverOptionsPanel title='Board Menu' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
                <div className={styles.wrapper}>
                    <div className={[styles.boardColour, viewOnlyBoard ? styles.disabled : ''].join(' ')}>
                        <header>Change Background Colour</header>
                        <div className={styles.colourGrid}>
                            {
                                availableColours.map(colour => {
                                    const selectedColour = colour === boardColour ? styles.selectedBoardColour : null; 
                                    return (
                                        <button key={colour} 
                                            disabled={viewOnlyBoard}
                                            className={[styles[colour], selectedColour].join(' ')} 
                                            onClick={e => {
                                                e.stopPropagation(); 
                                                handleBoardColourChange(colour); 
                                            }}></button>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.optionList}>
                        <div className='boardHeaderBarOptionsVisibilityForSmallScreen'>
                            <button disabled={viewOnlyBoard} onClick={e => {
                                e.stopPropagation(); 
                                handleFavoriteBoardButton(); 
                            }}>
                                {/* favorite logo */}
                                <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" 
                                        fill={favouriteBoard ? "#FFD700" : "none"} 
                                        stroke={favouriteBoard ? "#FFD700" : "#000000"} 
                                        strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg> 
                                <span>{favouriteBoard ? 'Unfavourite' : 'Favourite'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </HoverOptionsPanel>
        ); 
    }

    return (
        <HoverOptionsPanel title='Board Menu' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.wrapper}>
                <div className={[styles.boardColour, viewOnlyBoard ? styles.disabled : ''].join(' ')}>
                    <header>Change Background Colour</header>
                    <div className={styles.colourGrid}>
                        {
                            availableColours.map(colour => {
                                const selectedColour = colour === boardColour ? styles.selectedBoardColour : null; 
                                return (
                                    <button key={colour} 
                                        disabled={viewOnlyBoard}
                                        className={[styles[colour], selectedColour].join(' ')} 
                                        onClick={e => {
                                            e.stopPropagation(); 
                                            handleBoardColourChange(colour); 
                                        }}></button>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={styles.optionList}>
                    <div className='boardHeaderBarOptionsVisibilityForSmallScreen'>
                        <button disabled={viewOnlyBoard} onClick={e => {
                            e.stopPropagation(); 
                            handleFavoriteBoardButton(); 
                        }}>
                            {/* favorite logo */}
                            <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" 
                                    fill={favouriteBoard ? "#FFD700" : "none"} 
                                    stroke={favouriteBoard ? "#FFD700" : "#000000"} 
                                    strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg> 
                            <span>{favouriteBoard ? 'Unfavourite' : 'Favourite'}</span>
                        </button>
                    </div>
                    <button disabled={viewOnlyBoard || isNotOwner} onClick={e => {
                        e.stopPropagation(); 
                        setActivePanel('manageMembersOptions'); 
                    }}>
                        {/* members logo */}
                        <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                            width="100px" height="100px" viewBox="0 0 549.907 549.908">
                            <g>
                                <path d="M110.534,220.962c0-49.027,39.741-88.768,88.768-88.768s88.768,39.741,88.768,88.768c0,49.026-39.741,88.768-88.768,88.768
                                    S110.534,269.989,110.534,220.962z M236.968,315.783h-75.327c-62.668,0-113.655,50.986-113.655,113.646v92.143l0.236,1.437
                                    l6.36,1.985c59.796,18.679,111.764,24.914,154.531,24.914c83.531,0,131.94-23.82,134.938-25.333l5.94-3.015l0.626,0.006v-92.137
                                    C350.617,366.769,299.631,315.783,236.968,315.783z M350.617,177.533c49.024,0,88.768-39.741,88.768-88.768
                                    C439.385,39.741,399.642,0,350.617,0c-49.023,0-88.768,39.741-88.768,88.765C261.85,137.792,301.594,177.533,350.617,177.533z
                                    M388.28,183.585h-75.326c-1.797,0-3.547,0.189-5.32,0.275c6.81,14.295,10.74,30.225,10.74,47.094
                                    c0,31.129-13.057,59.205-33.922,79.23c48.823,14.523,86.144,55.986,94.638,107.08c71.999-3.145,113.504-23.49,116.265-24.885
                                    l5.94-3.015l0.626,0.012v-92.137C501.933,234.575,450.946,183.585,388.28,183.585z"
                                    fill='#000000'/>
                            </g>
                        </svg>
                        <span>Manage Members</span>
                    </button>
                    <div className='boardHeaderBarOptionsVisibilityForSmallScreen'>
                        <button disabled={viewOnlyBoard || isNotOwner} onClick={e => {
                            e.stopPropagation();
                            setActivePanel('shareBoardOptions'); 
                        }}>
                            {/* Share logo */}
                            <svg width="100px" height="100px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fillRule="evenodd" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" transform="translate(4 2)">
                                    <path d="m8.5 2.5-1.978-2-2.022 2"/>
                                    <path d="m6.5.5v9"/>
                                    <path d="m3.5 4.5h-1c-1.1045695 0-2 .8954305-2 2v7c0 1.1045695.8954305 2 2 2h8c1.1045695 0 2-.8954305 2-2v-7c0-1.1045695-.8954305-2-2-2h-1"/>
                                </g>
                            </svg>
                            <span>Share</span>
                        </button>
                    </div>
                </div>
                <div className={styles.deleteBoardButton}>
                    <Button disabled={viewOnlyBoard || isNotOwner} name='Delete Board' color='red' onClick={() => { setShowDeleteBoard(true) }} />
                </div>
            </div>
            {showDeleteBoard && <DeleteBoardDialogBox boardId={boardId} onCancel={() => setShowDeleteBoard(false)}/>}
        </HoverOptionsPanel>
    ); 
}