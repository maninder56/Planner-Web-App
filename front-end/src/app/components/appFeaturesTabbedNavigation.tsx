
import styles from '@/app/components/appFeaturesTabbedNavigation.module.css'; 
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface tabInterface {
    tabId: number;
    tabTitle: string;
    imageSrc: string;
    description: string; 
}

export default function AppFeaturesTabbedNavigation() {
    const tabs = [
    {
        tabId: 0,
        tabTitle: 'Visualise Your Workflow',
        imageSrc: '/manageCards.gif',
        description: 'Track every task from start to finish with an intuitive Kanban board. Drag and drop cards between columns, create custom workflows, and keep every project organised at a glance.'
    },
    {
        tabId: 1,
        tabTitle: 'Manage Multiple Boards',
        imageSrc: '/multipleProjects.gif',
        description: 'Create separate boards for different projects, teams, or clients. Switch between them effortlessly while keeping every workflow organised and easy to manage.'
    },
    {
        tabId: 2,
        tabTitle: 'Collaborate in Real Time',
        imageSrc: '/collaborate.gif',
        description: 'Invite teammates to your boards, assign work, and collaborate on projects together. Keep everyone aligned with a shared view of progress.'
    },
    {
        tabId: 3,
        tabTitle: 'Personalise Your Workspace',
        imageSrc: '/customise.gif',
        description: 'Customise your workspace with colours that match your style. Create an environment that feels familiar and helps you stay focused.'
    }
];

    const [currentTab, setCurrentTab] = useState<tabInterface>(tabs[0]); 
    const scrollTargetRef = useRef<null | HTMLDivElement>(null); 
    
    return (
        <div className={styles.container} ref={scrollTargetRef} >
            <div>
                <div className={styles.headerContainer}>
                    {tabs.map((content) => 
                        <button key={content.tabId}
                            onClick={() => {
                                setCurrentTab(content); 
                                // scrollTargetRef.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest' }); 
                            }}
                            className={content.tabId === currentTab.tabId ? styles.active : undefined}>
                            {content.tabTitle}
                        </button>
                    )}
                </div>
                <div className={styles.contentContainer}>
                    <div>
                        <div className={styles.feature} key={currentTab.tabId}>
                            <Image src={currentTab.imageSrc} unoptimized={true} alt={`${currentTab.tabTitle} image`} width={640} height={400} loading='eager' />
                            <p>{currentTab.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}