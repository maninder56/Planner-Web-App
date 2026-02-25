'use client'

import { panelType, profileColour } from '@/app/dashboard/Types/UIState';
import { useEffect, useRef, useState } from 'react';
import SearchBar from './components/Search/SearchBar/searchBar';
import DashboardMenuButton from './components/DashboardOptions/DashboardMenu/dashboardMenuButton';

import styles from './page.module.css'; 
import AppLogo from './components/AppLogo/appLogo';
import SearchButton from './components/Search/SearchButton/searchButton';
import { ActivePanelContext } from './Hooks/ActivePanel/ActivePanelContext';
import NewBoardButton from './components/DashboardOptions/NewBoard/newBoardButton';
import SwitchBoardButton from './components/DashboardOptions/SwitchBoard/switchBoardButton';
import ProfileButton from './components/DashboardOptions/Profile/ProfileButton/profileButton';
import BoardHeaderBar from './components/Board/BoardHeader/boardHeaderBar';
import Button from '@/Components/Buttons/button';
import { BoardDataFromAPI } from './Types/boardTypes';
import { useBoardStore } from './Store/boardStore';
import { NormaliseBoardData } from './Utilities/boardData';
import BoardContent from './components/Board/BoardContent/boardContent';
import { useBoardUIStore } from './Store/boardUIStore';

export default function Dashboard() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 
    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const hasHydrated = useRef(false); 


    // Main board object for managing current board
    const currentBoard: BoardDataFromAPI = {
        id: 1,
        title: "Product Development Q1",
        boardColour: "soft-pink",
        isFavoriteBoard: false, 
        boardLists: [
        {
            id: 101,
            title: "Backlog",
            listColour: "not completed yet",
            position: 0,
            cardList: [
            {
                id: 1001,
                title: "User authentication system",
                description: "Implement OAuth 2.0 login with Google and GitHub providers",
                done: false,
                priority: "High",
                dueDate: new Date("2026-03-15"),
                position: 0
            },
            {
                id: 1002,
                title: "Design new landing page",
                description: "Create mockups and prototypes for homepage redesign",
                done: false,
                priority: "Medium",
                dueDate: new Date("2026-03-20"),
                position: 1
            },
            {
                id: 1003,
                title: "Fix mobile responsiveness",
                description: "Address layout issues on tablets and mobile devices",
                done: false,
                priority: "Low",
                dueDate: new Date("2026-03-25"),
                position: 2
            }
            ]
        },
        {
            id: 102,
            title: "In Progress",
            listColour: "not completed yet",
            position: 1,
            cardList: [
            {
                id: 1004,
                title: "API documentation",
                description: "Complete API endpoints documentation using Swagger",
                done: false,
                priority: "High",
                dueDate: new Date("2026-02-18"),
                position: 0
            },
            {
                id: 1005,
                title: "Database optimization",
                description: "Add indexes and optimize slow queries",
                done: false,
                priority: "Medium",
                dueDate: new Date("2026-02-22"),
                position: 1
            }
            ]
        },
        {
            id: 103,
            title: "Done",
            listColour: "not completed yet",
            position: 2,
            cardList: [
                {
                    id: 1006,
                    title: "Setup CI/CD pipeline",
                    description: "Configure GitHub Actions for automated testing and deployment",
                    done: true,
                    priority: "High",
                    dueDate: new Date("2026-02-10"),
                    position: 0
                },
                {
                    id: 1007,
                    title: "Create project roadmap",
                    description: "Define milestones and deliverables for Q1",
                    done: true,
                    priority: "Medium",
                    dueDate: new Date("2026-02-05"),
                    position: 1
                }
            ]
        }
        ]
    }; 

    // useEffect(() => {
    //     if (!hasHydrated.current) {
    //         hydrateBoard(NormaliseBoardData(currentBoard)); 
    //         hasHydrated.current = true;             
    //     }
    // },[]); 

    hydrateBoard(NormaliseBoardData(currentBoard)); 

    
    const tempUser: { name: string, email: string, colour: profileColour} = {
        name: 'Julius Caesar', email: 'caesa23r@gmail.com', colour: 'red'
    }

    return (
        <div className={styles.page}
            onClick={(e) => {
                e.stopPropagation(); 
                setActivePanel('none'); 
            }}>
                {/* App logo search and profile options */}
                <section className={styles.firstSection}>
                    <div className={styles.appLogo}>
                        <AppLogo />
                    </div>
                    <div className={styles.searchWrapper}>
                        <div className={styles.searchButton}>
                            <SearchButton />
                        </div>
                        <div className={styles.searchBar}>
                            <SearchBar />
                        </div>
                    </div>
                    <div className={styles.dashboardMenuWrapper}>
                        <div className={styles.dashboardMenu}>
                            <DashboardMenuButton />
                        </div>
                        <div className={styles.dashboardOptions}>
                            <NewBoardButton />
                            <SwitchBoardButton />
                            <ProfileButton userName={tempUser.name} userEmail={tempUser.email} iconColour={tempUser.colour} />
                        </div>
                    </div>
                </section>
                <main className={styles.mainContent}>
                    <section>
                        <BoardHeaderBar boardColour={currentBoard.boardColour} />
                    </section>
                    <section>
                        <BoardContent />
                    </section>
                </main>
        </div>
    ); 
}