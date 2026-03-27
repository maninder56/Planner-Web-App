'use client'

import { panelType, profileColour } from '@/app/dashboard/Types/UIState';
import { Suspense, useEffect, useRef, useState } from 'react';

import styles from './page.module.css'; 
import BoardHeaderBar from './components/Board/BoardHeader/boardHeaderBar';
import { BoardDataFromAPI } from './Types/boardTypes';
import { useBoardStore } from './Store/boardStore';
import { NormaliseBoardData } from './Utilities/boardData';
import BoardContent from './components/Board/BoardContent/boardContent';
import { useBoardUIStore } from './Store/boardUIStore';
import DashboardHeader from './components/DashboardHeader/dashboardHeader';
import { LastUsedBoardRequest } from './Services/boardService';
import Board from './components/Board/board';
import { UserProfileDataRequest } from '@/Services/userService';
import { useUserStore } from './Store/userStore';
import { ApiRequestWithRefreshTokenAttempt } from '@/Services/ApiRequest';
import HoverConfirmation from '@/Components/HoverConfirmation/hoverConfirmation';
import SessionExpired from '@/Components/Alert/SessionExpired/sessionExpired';

export default function Dashboard() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const isSessionExpired = useUserStore((state) => (state.userData === undefined) && !state.isUserDataLoading); 

    return (
        <div className={styles.page}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('none'); 
            }}>
                <DashboardHeader />
                <Board />   
                {
                    isSessionExpired ? 
                    <SessionExpired />
                    : null
                }
        </div>
    ); 
}



    // // Main board object for managing current board
    // const currentBoard: BoardDataFromAPI = {
    //     id: 1,
    //     title: "Product Development Q1",
    //     boardColour: "soft-pink",
    //     isFavoriteBoard: false, 
    //     role: "Owner",
    //     boardLists: [
    //     {
    //         id: 101,
    //         title: "Backlog",
    //         position: 0,
    //         cardList: [
    //         {
    //             id: 1001,
    //             title: "User authentication system",
    //             description: "Implement OAuth 2.0 login with Google and GitHub providers",
    //             done: false,
    //             priority: "High",
    //             dueDate: new Date("2026-03-15"),
    //             position: 0
    //         },
    //         {
    //             id: 1002,
    //             title: "Design new landing page",
    //             description: "Create mockups and prototypes for homepage redesign",
    //             done: false,
    //             priority: "Medium",
    //             dueDate: new Date("2026-03-20"),
    //             position: 1
    //         },
    //         {
    //             id: 1003,
    //             title: "Fix mobile responsiveness",
    //             description: "Address layout issues on tablets and mobile devices",
    //             done: false,
    //             priority: "Low",
    //             dueDate: new Date("2026-03-25"),
    //             position: 2
    //         }
    //         ]
    //     },
    //     {
    //         id: 102,
    //         title: "In Progress",
    //         position: 1,
    //         cardList: [
    //         {
    //             id: 1004,
    //             title: "API documentation",
    //             description: "Complete API endpoints documentation using Swagger",
    //             done: false,
    //             priority: "High",
    //             dueDate: new Date("2026-02-18"),
    //             position: 0
    //         },
    //         {
    //             id: 1005,
    //             title: "Database optimization",
    //             description: "Add indexes and optimize slow queries",
    //             done: false,
    //             priority: "Medium",
    //             dueDate: new Date("2026-02-22"),
    //             position: 1
    //         }
    //         ]
    //     },
    //     {
    //         id: 103,
    //         title: "Done",
    //         position: 2,
    //         cardList: [
    //             {
    //                 id: 1006,
    //                 title: "Setup CI/CD pipeline",
    //                 description: "Configure GitHub Actions for automated testing and deployment",
    //                 done: true,
    //                 priority: "High",
    //                 dueDate: new Date("2026-02-10"),
    //                 position: 0
    //             },
    //             {
    //                 id: 1007,
    //                 title: "Create project roadmap",
    //                 description: "Define milestones and deliverables for Q1",
    //                 done: true,
    //                 priority: "Medium",
    //                 dueDate: new Date("2026-02-05"),
    //                 position: 1
    //             }
    //         ]
    //     }
    //     ]
    // }; 

    // useEffect(() => {
    //     if (!hasHydrated.current) {
    //         hydrateBoard(NormaliseBoardData(currentBoard)); 
    //         hasHydrated.current = true;             
    //     }
    // },[]);